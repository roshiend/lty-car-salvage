import type { NextRequest } from "next/server"

export type VisitGeo = {
  country: string | null
  region: string | null
  city: string | null
}

/** Approximate location from Vercel / edge headers (no raw IP stored). */
export function getVisitGeo(request: NextRequest): VisitGeo {
  const geo = request.geo
  const country =
    geo?.country ?? request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry")
  const region = geo?.region ?? request.headers.get("x-vercel-ip-country-region")
  const city = geo?.city ?? request.headers.get("x-vercel-ip-city")

  return {
    country: country?.trim() || null,
    region: region?.trim() || null,
    city: city?.trim() || null,
  }
}
