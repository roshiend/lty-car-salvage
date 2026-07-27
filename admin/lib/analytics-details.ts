import { pool } from "@/lib/db"

export type AnalyticsPeriodDays = 7 | 30 | 90

export type NamedCount = { name: string; count: number; pct: number }

export type RecentVisitRow = {
  id: number
  createdAt: Date
  path: string
  trafficSource: string
  referrerHost: string | null
  utmCampaign: string | null
  area: string
  isFirstVisit: boolean
}

export type StorefrontAnalyticsDetails = {
  periodDays: AnalyticsPeriodDays
  uniqueVisitors: number
  pageViews: number
  trafficSources: NamedCount[]
  leadSources: NamedCount[]
  topAreas: NamedCount[]
  topPages: NamedCount[]
  topReferrers: NamedCount[]
  recentVisits: RecentVisitRow[]
}

export function formatVisitorArea(country: string | null, region: string | null, city: string | null): string {
  const parts = [city, region, country].filter(Boolean)
  if (parts.length === 0) return "Unknown area"
  return parts.join(", ")
}

function withPct(rows: { name: string; count: string }[], total: number): NamedCount[] {
  return rows.map((r) => {
    const count = parseInt(r.count, 10) || 0
    return {
      name: r.name,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }
  })
}

const PERIOD_FILTER = `created_at >= NOW() - make_interval(days => $1::int)`

export async function getStorefrontAnalyticsDetails(
  periodDays: AnalyticsPeriodDays = 30
): Promise<StorefrontAnalyticsDetails | null> {
  try {
    const summary = await pool.query<{ unique_visitors: string; page_views: string }>(
      `
      SELECT
        COUNT(DISTINCT visitor_id)::text AS unique_visitors,
        COUNT(*)::text AS page_views
      FROM storefront_page_views
      WHERE ${PERIOD_FILTER}
    `,
      [periodDays]
    )

    const uniqueVisitors = parseInt(summary.rows[0]?.unique_visitors ?? "0", 10) || 0
    const pageViews = parseInt(summary.rows[0]?.page_views ?? "0", 10) || 0

    const trafficRes = await pool.query<{ name: string; count: string }>(
      `
      SELECT traffic_source AS name, COUNT(DISTINCT visitor_id)::text AS count
      FROM storefront_page_views
      WHERE ${PERIOD_FILTER}
      GROUP BY traffic_source
      ORDER BY COUNT(DISTINCT visitor_id) DESC
      LIMIT 12
    `,
      [periodDays]
    )

    const leadRes = await pool.query<{ name: string; count: string }>(
      `
      SELECT traffic_source AS name, COUNT(*)::text AS count
      FROM (
        SELECT DISTINCT ON (visitor_id) visitor_id, traffic_source, created_at
        FROM storefront_page_views
        WHERE ${PERIOD_FILTER}
        ORDER BY visitor_id, created_at ASC
      ) first_touch
      GROUP BY traffic_source
      ORDER BY COUNT(*) DESC
      LIMIT 12
    `,
      [periodDays]
    )

    const areasRes = await pool.query<{ name: string; count: string }>(
      `
      SELECT
        TRIM(
          CONCAT_WS(
            ', ',
            NULLIF(city, ''),
            NULLIF(region, ''),
            NULLIF(country, '')
          )
        ) AS name,
        COUNT(DISTINCT visitor_id)::text AS count
      FROM storefront_page_views
      WHERE ${PERIOD_FILTER}
      GROUP BY country, region, city
      HAVING TRIM(
        CONCAT_WS(
          ', ',
          NULLIF(city, ''),
          NULLIF(region, ''),
          NULLIF(country, '')
        )
      ) <> ''
      ORDER BY COUNT(DISTINCT visitor_id) DESC
      LIMIT 15
    `,
      [periodDays]
    )

    const unknownAreaRes = await pool.query<{ count: string }>(
      `
      SELECT COUNT(DISTINCT visitor_id)::text AS count
      FROM storefront_page_views
      WHERE ${PERIOD_FILTER}
        AND COALESCE(NULLIF(country, ''), NULLIF(region, ''), NULLIF(city, '')) IS NULL
    `,
      [periodDays]
    )
    const unknownAreaCount = parseInt(unknownAreaRes.rows[0]?.count ?? "0", 10) || 0

    const pagesRes = await pool.query<{ name: string; count: string }>(
      `
      SELECT path AS name, COUNT(*)::text AS count
      FROM storefront_page_views
      WHERE ${PERIOD_FILTER}
      GROUP BY path
      ORDER BY COUNT(*) DESC
      LIMIT 12
    `,
      [periodDays]
    )

    const referrersRes = await pool.query<{ name: string; count: string }>(
      `
      SELECT COALESCE(referrer_host, 'Direct / none') AS name, COUNT(DISTINCT visitor_id)::text AS count
      FROM storefront_page_views
      WHERE ${PERIOD_FILTER}
      GROUP BY referrer_host
      ORDER BY COUNT(DISTINCT visitor_id) DESC
      LIMIT 12
    `,
      [periodDays]
    )

    const recentRes = await pool.query<{
      id: number
      created_at: Date
      path: string
      traffic_source: string
      referrer_host: string | null
      utm_campaign: string | null
      country: string | null
      region: string | null
      city: string | null
      is_first: boolean
    }>(
      `
      SELECT
        p.id,
        p.created_at,
        p.path,
        p.traffic_source,
        p.referrer_host,
        p.utm_campaign,
        p.country,
        p.region,
        p.city,
        (
          p.id = (
            SELECT MIN(p2.id)
            FROM storefront_page_views p2
            WHERE p2.visitor_id = p.visitor_id
          )
        ) AS is_first
      FROM storefront_page_views p
      WHERE p.created_at >= NOW() - make_interval(days => $1::int)
      ORDER BY p.created_at DESC
      LIMIT 40
    `,
      [periodDays]
    )

    const leadTotal = leadRes.rows.reduce((acc, r) => acc + (parseInt(r.count, 10) || 0), 0)

    const topAreas = withPct(areasRes.rows, uniqueVisitors)
    if (unknownAreaCount > 0) {
      topAreas.push({
        name: "Unknown area",
        count: unknownAreaCount,
        pct: uniqueVisitors > 0 ? Math.round((unknownAreaCount / uniqueVisitors) * 100) : 0,
      })
    }

    return {
      periodDays,
      uniqueVisitors,
      pageViews,
      trafficSources: withPct(trafficRes.rows, uniqueVisitors),
      leadSources: withPct(leadRes.rows, leadTotal),
      topAreas,
      topPages: withPct(pagesRes.rows, pageViews),
      topReferrers: withPct(referrersRes.rows, uniqueVisitors),
      recentVisits: recentRes.rows.map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        path: row.path,
        trafficSource: row.traffic_source,
        referrerHost: row.referrer_host,
        utmCampaign: row.utm_campaign,
        area: formatVisitorArea(row.country, row.region, row.city),
        isFirstVisit: row.is_first,
      })),
    }
  } catch (error) {
    console.error("Storefront analytics details unavailable:", error)
    return null
  }
}
