"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteCar } from "@/app/actions/cars"
import { Trash2, Loader2 } from "lucide-react"

export default function DeleteCarButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this car?")) return
    setLoading(true)
    await deleteCar(id)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-lg border transition-all hover:bg-red-50"
      style={{ borderColor: "var(--border)", color: "#dc2626" }}
      title="Delete"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </button>
  )
}
