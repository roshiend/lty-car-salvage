import { neon } from "@neondatabase/serverless"

const VISITOR_COOKIE = "lty_vid"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export { VISITOR_COOKIE, COOKIE_MAX_AGE }

export type StorefrontVisitPayload = {
  visitorId: string
  path: string
  referrer: string | null
  referrerHost: string | null
  trafficSource: string
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  country: string | null
  region: string | null
  city: string | null
}

export function isLikelyBot(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse/i.test(userAgent)
}

export function isValidVisitorId(value: string | undefined): value is string {
  return typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value)
}

export async function recordStorefrontVisit(payload: StorefrontVisitPayload): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return

  const sql = neon(databaseUrl)
  const { visitorId } = payload

  await sql`
    INSERT INTO storefront_visitors (id, first_seen_at, last_seen_at)
    VALUES (${visitorId}::uuid, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET last_seen_at = NOW()
  `
  await sql`
    INSERT INTO storefront_visitor_days (visitor_id, visit_date)
    VALUES (${visitorId}::uuid, CURRENT_DATE)
    ON CONFLICT DO NOTHING
  `
  await sql`
    INSERT INTO storefront_page_views (
      visitor_id,
      path,
      referrer,
      referrer_host,
      traffic_source,
      utm_source,
      utm_medium,
      utm_campaign,
      country,
      region,
      city
    ) VALUES (
      ${visitorId}::uuid,
      ${payload.path},
      ${payload.referrer},
      ${payload.referrerHost},
      ${payload.trafficSource},
      ${payload.utmSource},
      ${payload.utmMedium},
      ${payload.utmCampaign},
      ${payload.country},
      ${payload.region},
      ${payload.city}
    )
  `
}
