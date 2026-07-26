/**
 * One-time migration: add public_id UUIDs for storefront URLs.
 * Run: pnpm exec tsx scripts/migrate-car-public-id.ts (from storefront/)
 */
import "dotenv/config"
import { Pool } from "pg"

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error("DATABASE_URL is required")
    process.exit(1)
  }

  const pool = new Pool({ connectionString })

  await pool.query(`
    ALTER TABLE cars ADD COLUMN IF NOT EXISTS public_id uuid;
  `)
  await pool.query(`
    UPDATE cars SET public_id = gen_random_uuid() WHERE public_id IS NULL;
  `)
  await pool.query(`
    ALTER TABLE cars ALTER COLUMN public_id SET DEFAULT gen_random_uuid();
  `)
  await pool.query(`
    ALTER TABLE cars ALTER COLUMN public_id SET NOT NULL;
  `)
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS cars_public_id_unique ON cars (public_id);
  `)

  const { rows } = await pool.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM cars")
  console.log(`Done. cars table has ${rows[0]?.count} row(s) with public_id.`)

  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
