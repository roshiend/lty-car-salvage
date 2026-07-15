"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toggleSold } from "@/app/actions/cars"

export default function ToggleSoldButton({
  id,
  isSold,
}: {
  id: number
  isSold: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    await toggleSold(id, !isSold)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:opacity-80"
      style={
        isSold
          ? { background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }
          : { background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }
      }
    >
      {loading ? "..." : isSold ? "Sold" : "Available"}
    </button>
  )
}
