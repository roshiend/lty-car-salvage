/**
 * Add detailed page-view analytics (area, referrer, campaigns).
 * Run from storefront/: pnpm migrate:analytics
 */
import { config } from "dotenv"

config({ path: ".env.local" })
config()
import { Pool } from "pg"

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error("DATABASE_URL is required")
    process.exit(1)
  }

  const pool = new Pool({ connectionString })

  await pool.query(`
    CREATE TABLE IF NOT EXISTS storefront_page_views (
      id serial PRIMARY KEY,
      visitor_id uuid NOT NULL REFERENCES storefront_visitors(id) ON DELETE CASCADE,
      path text NOT NULL,
      referrer text,
      referrer_host text,
      traffic_source text NOT NULL,
      utm_source text,
      utm_medium text,
      utm_campaign text,
      country text,
      region text,
      city text,
      created_at timestamptz NOT NULL DEFAULT NOW()
    );
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS storefront_page_views_created_at_idx
    ON storefront_page_views (created_at DESC);
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS storefront_page_views_traffic_source_idx
    ON storefront_page_views (traffic_source);
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS storefront_page_views_country_idx
    ON storefront_page_views (country);
  `)

  console.log("Done. storefront_page_views is ready.")
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
