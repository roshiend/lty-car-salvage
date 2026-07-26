import { resolveMainSiteUrl } from "@/lib/env"

/** Ask the main site (separate Vercel project) to refresh cached pages after inventory changes. */
export async function revalidateStorefront(carId?: number): Promise<void> {
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET?.trim()
  if (!secret) return

  const base = resolveMainSiteUrl().replace(/\/$/, "")
  const paths = ["/", ...(carId != null ? [`/cars/${carId}`] : [])]

  try {
    await fetch(`${base}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ paths }),
    })
  } catch (error) {
    console.error("Storefront revalidation failed:", error)
  }
}
