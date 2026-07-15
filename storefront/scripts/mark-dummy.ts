import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { eq } from "drizzle-orm"
import * as schema from "../lib/db/schema"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool, { schema })

async function markDummyCars() {
  console.log("Marking existing seed cars as dummy...")

  const result = await db
    .update(schema.cars)
    .set({ isDummy: true, updatedAt: new Date() })
    .where(eq(schema.cars.registration, "LTY CARS"))
    .returning({ id: schema.cars.id, make: schema.cars.make, model: schema.cars.model })

  if (result.length === 0) {
    console.log("No cars matched registration 'LTY CARS'.")
  } else {
    for (const car of result) {
      console.log(`✅ Marked dummy: ${car.make} ${car.model} (#${car.id})`)
    }
    console.log(`\nDone. ${result.length} car(s) marked as dummy and hidden from the public site.`)
  }

  await pool.end()
}

markDummyCars().catch((err) => {
  console.error("Failed to mark dummy cars:", err)
  process.exit(1)
})
