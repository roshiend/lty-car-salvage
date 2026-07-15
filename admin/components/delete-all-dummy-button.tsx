"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteAllDummyCars } from "@/app/actions/cars"
import { Trash2, Loader2 } from "lucide-react"

export default function DeleteAllDummyButton({ count }: { count: number }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (count === 0) return null

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete all ${count} dummy listing${count === 1 ? "" : "s"}? This cannot be undone.`
      )
    ) {
      return
    }

    setLoading(true)
    await deleteAllDummyCars()
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:bg-red-50 disabled:opacity-60"
      style={{ borderColor: "#fecaca", color: "#dc2626", background: "#fef2f2" }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      Delete all dummy ({count})
    </button>
  )
}
