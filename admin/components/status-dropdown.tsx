"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateCarStatus } from "@/app/actions/cars"
import { CAR_STATUSES, getStatus } from "@/lib/car-status"
import { ChevronDown, Loader2 } from "lucide-react"

export default function StatusDropdown({
  id,
  status,
}: {
  id: number
  status: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(status || "available")
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const statusMeta = getStatus(current)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = async (value: string) => {
    if (value === current) { setOpen(false); return }
    setOpen(false)
    setLoading(true)
    setCurrent(value)
    await updateCarStatus(id, value)
    router.refresh()
    setLoading(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all hover:opacity-80 whitespace-nowrap"
        style={{
          background: statusMeta.bg,
          color: statusMeta.color,
          borderColor: statusMeta.border,
        }}
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: statusMeta.dot }}
          />
        )}
        {statusMeta.label}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 rounded-xl border overflow-hidden"
          style={{
            background: "#ffffff",
            borderColor: "var(--border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: "140px",
          }}
        >
          {CAR_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => handleSelect(s.value)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left transition-colors hover:bg-slate-50"
              style={{
                color: s.value === current ? s.color : "var(--text-secondary)",
                background: s.value === current ? s.bg : "transparent",
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: s.dot }}
              />
              {s.label}
              {s.value === current && (
                <span className="ml-auto text-xs" style={{ color: s.color }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
