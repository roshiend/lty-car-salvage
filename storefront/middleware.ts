import { NextResponse } from "next/server"
import type { NextRequest, NextFetchEvent } from "next/server"
import { neon } from "@neondatabase/serverless"
import {
  COOKIE_MAX_AGE,
  VISITOR_COOKIE,
  isLikelyBot,
  isValidVisitorId,
  recordStorefrontVisit,
} from "@/lib/record-storefront-visit"

async function redirectLegacyNumericCarUrl(request: NextRequest): Promise<NextResponse | null> {
  const match = request.nextUrl.pathname.match(/^\/cars\/(\d+)\/?$/)
  if (!match) return null

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return null

  const numericId = parseInt(match[1], 10)
  if (!Number.isFinite(numericId)) return null

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

  return null
}

function attachVisitorCookie(response: NextResponse, visitorId: string, isNew: boolean): void {
  if (isNew) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    })
  }
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const legacyRedirect = await redirectLegacyNumericCarUrl(request)
  if (legacyRedirect) {
    return legacyRedirect
  }

  const pathname = request.nextUrl.pathname
  if (pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const userAgent = request.headers.get("user-agent")
  if (isLikelyBot(userAgent)) {
    return NextResponse.next()
  }

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value
  const isNewVisitor = !isValidVisitorId(visitorId)
  if (isNewVisitor) {
    visitorId = crypto.randomUUID()
  }

  const response = NextResponse.next()
  attachVisitorCookie(response, visitorId!, isNewVisitor)

  if (process.env.DATABASE_URL) {
    event.waitUntil(
      recordStorefrontVisit(visitorId!).catch((error) => {
        console.error("Storefront visit tracking failed:", error)
      })
    )
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
