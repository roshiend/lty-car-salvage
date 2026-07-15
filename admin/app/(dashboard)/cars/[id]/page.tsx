import { db } from "@/lib/db"
import { cars } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import CarForm from "@/components/car-form"

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await db.select().from(cars).where(eq(cars.id, parseInt(id)))
  const car = result[0]

  if (!car) notFound()

  return <CarForm car={car} />
}
