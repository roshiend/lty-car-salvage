"use client"

import { useState, useRef, useCallback } from "react"
import {
  Upload,
  X,
  ImageIcon,
  Loader2,
  Link as LinkIcon,
  Plus,
  GripVertical,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

interface UploadingFile {
  id: string
  name: string
  preview: string
  progress: "uploading" | "done" | "error"
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [urlInput, setUrlInput] = useState("")
  const [urlError, setUrlError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith("image/"))
      if (!imageFiles.length) return

      // Create local preview entries immediately
      const newUploading: UploadingFile[] = imageFiles.map((f) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: f.name,
        preview: URL.createObjectURL(f),
        progress: "uploading",
      }))
      setUploading((prev) => [...prev, ...newUploading])

      const formData = new FormData()
      imageFiles.forEach((f) => formData.append("files", f))

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const data = await res.json()

        if (!res.ok || data.error) {
          // Mark as error
          setUploading((prev) =>
            prev.map((u) =>
              newUploading.find((n) => n.id === u.id)
                ? { ...u, progress: "error" }
                : u
            )
          )
          return
        }

        // Mark as done and add to images list
        setUploading((prev) =>
          prev.map((u) =>
            newUploading.find((n) => n.id === u.id)
              ? { ...u, progress: "done" }
              : u
          )
        )

        onChange([...images, ...data.urls])

        // Clean up done entries after a short delay
        setTimeout(() => {
          setUploading((prev) =>
            prev.filter((u) => !newUploading.find((n) => n.id === u.id))
          )
          // Revoke object URLs
          newUploading.forEach((u) => URL.revokeObjectURL(u.preview))
        }, 1200)
      } catch {
        setUploading((prev) =>
          prev.map((u) =>
            newUploading.find((n) => n.id === u.id)
              ? { ...u, progress: "error" }
              : u
          )
        )
      }
    },
    [images, onChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    uploadFiles(files)
    e.target.value = ""
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      uploadFiles(files)
    },
    [uploadFiles]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const removeUploading = (id: string) => {
    setUploading((prev) => prev.filter((u) => u.id !== id))
  }

  const addUrl = () => {
    setUrlError("")
    const url = urlInput.trim()
    if (!url) return
    try {
      new URL(url)
    } catch {
      setUrlError("Please enter a valid URL")
      return
    }
    onChange([...images, url])
    setUrlInput("")
  }

  const isAnyUploading = uploading.some((u) => u.progress === "uploading")
  const hasImages = images.length > 0 || uploading.length > 0

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed rounded-2xl cursor-pointer transition-all"
        style={{
          borderColor: dragOver ? "var(--brand)" : "var(--border)",
          background: dragOver ? "var(--brand-bg)" : "#fafafa",
          padding: hasImages ? "20px 24px" : "40px 24px",
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
            style={{
              background: dragOver ? "var(--brand-bg)" : "#f1f5f9",
              border: `1px solid ${dragOver ? "var(--brand)" : "var(--border)"}`,
            }}
          >
            {dragOver ? (
              <Upload className="w-6 h-6" style={{ color: "var(--brand)" }} />
            ) : (
              <ImageIcon className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {dragOver ? "Drop images here" : "Browse or drag & drop"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              JPG, PNG, WebP — up to 10MB each — multiple files supported
            </p>
          </div>
          <div
            className="mt-1 px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
            style={{
              borderColor: "var(--border)",
              background: "#ffffff",
              color: "var(--text-secondary)",
            }}
          >
            <Plus className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
            Select Images
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="absolute inset-0 opacity-0 cursor-pointer"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Thumbnail grid */}
      {hasImages && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            {images.length + uploading.filter(u => u.progress === "uploading").length} photo{images.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">

            {/* Uploaded images */}
            {images.map((img, i) => (
              <div
                key={img + i}
                className="relative group rounded-xl overflow-hidden border"
                style={{
                  aspectRatio: "1",
                  borderColor: "var(--border)",
                  background: "var(--background)",
                }}
              >
                <img
                  src={img}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E"
                  }}
                />

                {/* Order badge */}
                {i === 0 && (
                  <div
                    className="absolute top-1.5 left-1.5 text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "var(--brand)", color: "#fff", fontSize: "10px" }}
                  >
                    Cover
                  </div>
                )}

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "rgba(0,0,0,0.45)" }}
                >
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                    style={{ background: "#dc2626" }}
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Uploading placeholders */}
            {uploading.map((u) => (
              <div
                key={u.id}
                className="relative rounded-xl overflow-hidden border"
                style={{ aspectRatio: "1", borderColor: "var(--border)" }}
              >
                <img src={u.preview} alt="" className="w-full h-full object-cover" />

                {/* Progress overlay */}
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
                  {u.progress === "uploading" && (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  )}
                  {u.progress === "done" && (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                  {u.progress === "error" && (
                    <>
                      <AlertCircle className="w-5 h-5 text-white mb-1" />
                      <button
                        type="button"
                        onClick={() => removeUploading(u.id)}
                        className="text-white"
                        style={{ fontSize: "10px", textDecoration: "underline" }}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all hover:border-orange-400 hover:bg-orange-50"
              style={{ aspectRatio: "1", borderColor: "var(--border)", background: "#fafafa" }}
            >
              <Plus className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Add</span>
            </button>
          </div>
        </div>
      )}

      {/* URL input fallback */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
          <LinkIcon className="w-3 h-3 inline mr-1" />
          Or add by URL
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => { setUrlInput(e.target.value); setUrlError("") }}
            placeholder="https://example.com/photo.jpg"
            className="flex-1 rounded-xl px-3 py-2.5 text-sm"
            style={{
              border: `1px solid ${urlError ? "#dc2626" : "var(--border)"}`,
              background: "#ffffff",
              color: "var(--text-primary)",
              outline: "none",
            }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          />
          <button
            type="button"
            onClick={addUrl}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex-shrink-0 transition-all hover:bg-slate-50"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            Add URL
          </button>
        </div>
        {urlError && (
          <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>{urlError}</p>
        )}
      </div>

      {isAnyUploading && (
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />
          Uploading images, please wait before saving...
        </p>
      )}
    </div>
  )
}
