"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { cars } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

export async function getCars(includeAll = false) {
  if (!process.env.DATABASE_URL) return []

  try {
    if (includeAll) {
      return db.select().from(cars).orderBy(desc(cars.createdAt))
    }
    return db
      .select()
      .from(cars)
      .where(eq(cars.isDummy, false))
      .orderBy(desc(cars.createdAt))
  } catch (error) {
    console.error("Failed to fetch cars:", error)
    return []
  }
}

export async function getCarByPublicId(publicId: string) {
  if (!process.env.DATABASE_URL) return null

  try {
    const result = await db.select().from(cars).where(eq(cars.publicId, publicId))
    const car = result[0] || null
    if (!car || car.isDummy) return null
    return car
  } catch (error) {
    console.error("Failed to fetch car:", error)
    return null
  }
}

/** Legacy numeric URLs only — used for permanent redirect to publicId. */
export async function getCarByInternalId(id: number) {
  if (!process.env.DATABASE_URL) return null

  try {
    const result = await db.select().from(cars).where(eq(cars.id, id))
    const car = result[0] || null
    if (!car || car.isDummy) return null
    return car
  } catch (error) {
    console.error("Failed to fetch car:", error)
    return null
  }
}

/** @deprecated Use getCarByPublicId for storefront routes */
export async function getCarById(id: number) {
  return getCarByInternalId(id)
}

export async function createCar(data: {
  make: string
  model: string
  year: number
  price: string
  marketValue: string
  mileage: number
  fuelType: string
  transmission: string
  colour: string
  bodyType: string
  doors: number
  engineSize?: string
  category: string
  description?: string
  features?: string[]
  images?: string[]
  motExpiry?: string
}) {
  await getAdminSession()

  const result = await db
    .insert(cars)
    .values({
      ...data,
      motExpiry: data.motExpiry || null,
    })
    .returning()

  revalidatePath("/")
  revalidatePath("/admin")
  return result[0]
}

export async function updateCar(
  id: number,
  data: Partial<{
    make: string
    model: string
    year: number
    price: string
    marketValue: string
    mileage: number
    fuelType: string
    transmission: string
    colour: string
    bodyType: string
    doors: number
    engineSize: string
    category: string
    description: string
    features: string[]
    images: string[]
    motExpiry: string
    isSold: boolean
  }>
) {
  await getAdminSession()

  const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() }
  
  if (data.motExpiry !== undefined) {
    updateData.motExpiry = data.motExpiry || null
  }

  const result = await db
    .update(cars)
    .set(updateData)
    .where(eq(cars.id, id))
    .returning()

  revalidatePath("/")
  revalidatePath("/admin")
  if (result[0]?.publicId) {
    revalidatePath(`/cars/${result[0].publicId}`)
  }
  return result[0]
}

export async function deleteCar(id: number) {
  await getAdminSession()

  await db.delete(cars).where(eq(cars.id, id))

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function toggleCarSold(id: number, isSold: boolean) {
  await getAdminSession()

  const result = await db
    .update(cars)
    .set({ isSold, updatedAt: new Date() })
    .where(eq(cars.id, id))
    .returning()

  revalidatePath("/")
  revalidatePath("/admin")
  return result[0]
}
