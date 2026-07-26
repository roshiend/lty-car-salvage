import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"

/** Redirect legacy /cars/123 URLs to /cars/{uuid} before the page renders. */
export async function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/cars\/(\d+)\/?$/)
  if (!match) {
    return NextResponse.next()
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    return NextResponse.next()
  }

  const numericId = parseInt(match[1], 10)
  if (!Number.isFinite(numericId)) {
    return NextResponse.next()
  }

  try {
    const sql = neon(databaseUrl)
    const rows = await sql`
      SELECT public_id::text AS public_id
      FROM cars
      WHERE id = ${numericId}
      LIMIT 1
    `
    const publicId = rows[0]?.public_id as string | undefined
    if (publicId) {
      const url = request.nextUrl.clone()
      url.pathname = `/cars/${publicId}`
      return NextResponse.redirect(url, 308)
    }
  } catch (error) {
    console.error("Legacy car URL redirect failed:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/cars/:path*"],
}
