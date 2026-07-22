import type { MetadataRoute } from "next"
import { getCars } from "@/app/actions/cars"
import { SITE_URL } from "@/lib/brand"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await getCars()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/cat-s-and-n`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  const carPages: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${SITE_URL}/cars/${car.id}`,
    lastModified: car.updatedAt ?? now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticPages, ...carPages]
}
