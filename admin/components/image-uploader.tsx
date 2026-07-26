"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { normalizeImageUrl } from "@/lib/image-url"
import { X, Link as LinkIcon, Plus, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  images: string[]
  onChange: Dispatch<SetStateAction<string[]>>
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("")
  const [urlError, setUrlError] = useState("")

  const removeImage = (index: number) => {
    onChange((prev) => prev.filter((_, i) => i !== index))
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
    onChange((prev) => [...prev, normalizeImageUrl(url)])
    setUrlInput("")
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border px-4 py-3 text-sm"
        style={{ background: "#eff6ff", borderColor: "#bfdbfe", color: "#1e40af" }}
      >
        <p className="font-semibold">Google Drive photos</p>
        <ol className="list-decimal list-inside mt-1.5 space-y-0.5 text-xs" style={{ color: "#1d4ed8" }}>
          <li>Upload images to Google Drive</li>
          <li>Share → General access → <strong>Anyone with the link</strong></li>
          <li>Paste each share link below, then Save the car</li>
        </ol>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
          <LinkIcon className="w-3 h-3 inline mr-1" />
          Paste Google Drive link
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value)
              setUrlError("")
            }}
            placeholder="https://drive.google.com/file/d/…/view?usp=sharing"
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
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex-shrink-0 transition-all hover:bg-slate-50 flex items-center gap-1.5"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        {urlError && <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>{urlError}</p>}
      </div>

      {images.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            {images.length} photo{images.length !== 1 ? "s" : ""} (first = cover on website)
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {images.map((img, i) => (
              <div
                key={`${img}-${i}`}
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
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E"
                  }}
                />
                {i === 0 && (
                  <div
                    className="absolute top-1.5 left-1.5 text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "var(--brand)", color: "#fff", fontSize: "10px" }}
                  >
                    Cover
                  </div>
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "rgba(0,0,0,0.45)" }}
                >
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all"
                    style={{ background: "#dc2626" }}
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl border border-dashed py-10 flex flex-col items-center gap-2"
          style={{ borderColor: "var(--border)", background: "#fafafa" }}
        >
          <ImageIcon className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No photos yet — add Google Drive links above
          </p>
        </div>
      )}
    </div>
  )
}
