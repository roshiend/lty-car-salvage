"use client"

import { useState, useRef, useCallback, useEffect, type Dispatch, type SetStateAction } from "react"
import { isCloudinaryUrl } from "@/lib/image-url"
import {
  Upload,
  X,
  ImageIcon,
  Loader2,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface ImageUploaderProps {
  images: string[]
  onChange: Dispatch<SetStateAction<string[]>>
  onUploadingChange?: (uploading: boolean) => void
}

interface UploadingFile {
  id: string
  name: string
  preview: string
  progress: "uploading" | "done" | "error"
}

export default function ImageUploader({ images, onChange, onUploadingChange }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith("image/"))
      if (!imageFiles.length) return

      const newUploading: UploadingFile[] = imageFiles.map((f) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: f.name,
        preview: URL.createObjectURL(f),
        progress: "uploading",
      }))
      setUploading((prev) => [...prev, ...newUploading])
      setUploadError("")

      const formData = new FormData()
      imageFiles.forEach((f) => formData.append("files", f))

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const data = await res.json()

        if (!res.ok || data.error) {
          setUploadError(
            typeof data.error === "string"
              ? data.error
              : "Upload failed — check Cloudinary env vars on Vercel."
          )
          setUploading((prev) =>
            prev.map((u) =>
              newUploading.find((n) => n.id === u.id) ? { ...u, progress: "error" } : u
            )
          )
          return
        }

        onChange((prev) => [...prev, ...(data.urls as string[])])

        setUploading((prev) =>
          prev.map((u) =>
            newUploading.find((n) => n.id === u.id) ? { ...u, progress: "done" } : u
          )
        )

        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => !newUploading.find((n) => n.id === u.id)))
          newUploading.forEach((u) => URL.revokeObjectURL(u.preview))
        }, 1200)
      } catch {
        setUploadError("Upload failed — network or server error.")
        setUploading((prev) =>
          prev.map((u) =>
            newUploading.find((n) => n.id === u.id) ? { ...u, progress: "error" } : u
          )
        )
      }
    },
    [onChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(Array.from(e.target.files || []))
    e.target.value = ""
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      uploadFiles(Array.from(e.dataTransfer.files))
    },
    [uploadFiles]
  )

  const removeImage = (index: number) => {
    onChange((prev) => prev.filter((_, i) => i !== index))
  }

  const removeUploading = (id: string) => {
    setUploading((prev) => prev.filter((u) => u.id !== id))
  }

  const isAnyUploading = uploading.some((u) => u.progress === "uploading")
  const hasImages = images.length > 0 || uploading.length > 0

  useEffect(() => {
    onUploadingChange?.(isAnyUploading)
  }, [isAnyUploading, onUploadingChange])

  return (
    <div className="space-y-4">
      {uploadError && (
        <div
          className="rounded-xl border px-4 py-3 text-sm"
          style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c" }}
        >
          {uploadError}
        </div>
      )}

      <div
        className="rounded-xl border px-4 py-3 text-sm"
        style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534" }}
      >
        <p className="font-semibold">Cloudinary (free plan)</p>
        <p className="text-xs mt-1" style={{ color: "#15803d" }}>
          JPG, PNG, or WebP up to 10MB each. Photos are stored in your Cloudinary account and shown on
          ltyway.co.uk.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed rounded-2xl cursor-pointer transition-all"
        style={{
          borderColor: dragOver ? "var(--brand)" : "var(--border)",
          background: dragOver ? "var(--brand-bg)" : "#fafafa",
          padding: hasImages ? "20px 24px" : "36px 24px",
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "#f1f5f9", border: "1px solid var(--border)" }}
          >
            {dragOver ? (
              <Upload className="w-6 h-6" style={{ color: "var(--brand)" }} />
            ) : (
              <ImageIcon className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
            )}
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {dragOver ? "Drop photos here" : "Browse or drag & drop car photos"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Uploads go to Cloudinary — wait for each photo to finish before Save
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {hasImages && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            {images.length} photo{images.length !== 1 ? "s" : ""} (first = cover)
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {images.map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative group rounded-xl overflow-hidden border"
                style={{ aspectRatio: "1", borderColor: "var(--border)" }}
              >
                <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <div
                    className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "var(--brand)", color: "#fff" }}
                  >
                    Cover
                  </div>
                )}
                {isCloudinaryUrl(img) && (
                  <div
                    className="absolute bottom-1 left-1 text-[9px] font-semibold px-1 py-0.5 rounded"
                    style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                  >
                    Cloudinary
                  </div>
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "rgba(0,0,0,0.45)" }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(i)
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ background: "#dc2626" }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {uploading.map((u) => (
              <div
                key={u.id}
                className="relative rounded-xl overflow-hidden border"
                style={{ aspectRatio: "1", borderColor: "var(--border)" }}
              >
                <img src={u.preview} alt="" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{
                    background:
                      u.progress === "uploading"
                        ? "rgba(0,0,0,0.55)"
                        : u.progress === "done"
                          ? "rgba(22,163,74,0.7)"
                          : "rgba(220,38,38,0.7)",
                  }}
                >
                  {u.progress === "uploading" && <Loader2 className="w-6 h-6 text-white animate-spin" />}
                  {u.progress === "done" && <CheckCircle className="w-6 h-6 text-white" />}
                  {u.progress === "error" && (
                    <>
                      <AlertCircle className="w-5 h-5 text-white mb-1" />
                      <button type="button" onClick={() => removeUploading(u.id)} className="text-white text-[10px] underline">
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1"
              style={{ aspectRatio: "1", borderColor: "var(--border)", background: "#fafafa" }}
            >
              <Plus className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Add
              </span>
            </button>
          </div>
        </div>
      )}

      {isAnyUploading && (
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />
          Uploading to Cloudinary…
        </p>
      )}
    </div>
  )
}
