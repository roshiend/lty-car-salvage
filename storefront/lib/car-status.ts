export const STOCK_STATUS_LABELS: Record<
  string,
  { label: string; className: string }
> = {
  available: { label: "Available", className: "bg-emerald-600 text-white" },
  reserved: { label: "Reserved", className: "bg-violet-600 text-white" },
  reduced: { label: "Reduced", className: "bg-amber-600 text-white" },
  sold: { label: "Sold", className: "bg-slate-600 text-white" },
}

export function stockStatusLabel(status: string | null | undefined) {
  return STOCK_STATUS_LABELS[status ?? "available"] ?? STOCK_STATUS_LABELS.available
}
