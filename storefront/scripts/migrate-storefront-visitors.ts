/**
 * Create tables for first-party storefront unique visitor tracking.
 * Run from storefront/: pnpm migrate:visitors
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
    CREATE TABLE IF NOT EXISTS storefront_visitors (
      id uuid PRIMARY KEY,
      first_seen_at timestamptz NOT NULL DEFAULT NOW(),
      last_seen_at timestamptz NOT NULL DEFAULT NOW()
    );
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS storefront_visitor_days (
      visitor_id uuid NOT NULL REFERENCES storefront_visitors(id) ON DELETE CASCADE,
      visit_date date NOT NULL,
      PRIMARY KEY (visitor_id, visit_date)
    );
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS storefront_visitor_days_visit_date_idx
    ON storefront_visitor_days (visit_date);
  `)

  console.log("Done. storefront_visitors and storefront_visitor_days are ready.")
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
