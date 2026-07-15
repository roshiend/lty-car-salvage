export const CAR_STATUSES = [
  {
    value: "available",
    label: "Available",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    dot: "#16a34a",
  },
  {
    value: "reserved",
    label: "Reserved",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    dot: "#7c3aed",
  },
  {
    value: "reduced",
    label: "Reduced",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    dot: "#d97706",
  },
  {
    value: "sold",
    label: "Sold",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    dot: "#2563eb",
  },
] as const

export type CarStatus = (typeof CAR_STATUSES)[number]["value"]

export function getStatus(value: string | null | undefined) {
  return CAR_STATUSES.find((s) => s.value === value) ?? CAR_STATUSES[0]
}
