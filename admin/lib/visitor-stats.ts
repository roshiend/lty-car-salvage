import { pool } from "@/lib/db"

export type StorefrontVisitorStats = {
  today: number
  last7Days: number
  last30Days: number
  allTime: number
}

export async function getStorefrontVisitorStats(): Promise<StorefrontVisitorStats | null> {
  try {
    const { rows } = await pool.query<{
      today: string
      last_7_days: string
      last_30_days: string
      all_time: string
    }>(`
      SELECT
        (SELECT COUNT(DISTINCT visitor_id)::text FROM storefront_visitor_days WHERE visit_date = CURRENT_DATE) AS today,
        (SELECT COUNT(DISTINCT visitor_id)::text FROM storefront_visitor_days WHERE visit_date >= CURRENT_DATE - INTERVAL '6 days') AS last_7_days,
        (SELECT COUNT(DISTINCT visitor_id)::text FROM storefront_visitor_days WHERE visit_date >= CURRENT_DATE - INTERVAL '29 days') AS last_30_days,
        (SELECT COUNT(*)::text FROM storefront_visitors) AS all_time
    `)

    const row = rows[0]
    if (!row) {
      return { today: 0, last7Days: 0, last30Days: 0, allTime: 0 }
    }

    return {
      today: parseInt(row.today, 10) || 0,
      last7Days: parseInt(row.last_7_days, 10) || 0,
      last30Days: parseInt(row.last_30_days, 10) || 0,
      allTime: parseInt(row.all_time, 10) || 0,
    }
  } catch (error) {
    console.error("Storefront visitor stats unavailable:", error)
    return null
  }
}
