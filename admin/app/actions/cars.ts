"use server"

import { db } from "@/lib/db"
import { cars } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { revalidateStorefront } from "@/lib/revalidate-storefront"
import { normalizeImageUrls } from "@/lib/image-url"

async function publicIdForCar(id: number): Promise<string | undefined> {
  const rows = await db
    .select({ publicId: cars.publicId })
    .from(cars)
    .where(eq(cars.id, id))
    .limit(1)
  return rows[0]?.publicId
}

export async function createCar(formData: FormData) {
  const status = (formData.get("status") as string) || "available"
  const data = {
    make: formData.get("make") as string,
    model: formData.get("model") as string,
    year: parseInt(formData.get("year") as string),
    price: formData.get("price") as string,
    marketValue: formData.get("marketValue") as string,
    mileage: parseInt(formData.get("mileage") as string),
    fuelType: formData.get("fuelType") as string,
    transmission: formData.get("transmission") as string,
    colour: formData.get("colour") as string,
    bodyType: formData.get("bodyType") as string,
    doors: parseInt(formData.get("doors") as string),
    engineSize: (formData.get("engineSize") as string) || null,
    category: formData.get("category") as string,
    description: (formData.get("description") as string) || null,
    registration: (formData.get("registration") as string) || null,
    motExpiry: (formData.get("motExpiry") as string) || null,
    images: normalizeImageUrls(JSON.parse((formData.get("images") as string) || "[]")),
    features: (formData.get("features") as string)
      ?.split("\n")
      .map((f) => f.trim())
      .filter(Boolean) || [],
    status,
    isSold: status === "sold",
    isDummy: false,
  }

  const inserted = await db.insert(cars).values(data).returning({ publicId: cars.publicId })
  revalidatePath("/cars")
  revalidatePath("/dashboard")
  await revalidateStorefront(inserted[0]?.publicId)
  redirect("/cars")
}

export async function updateCar(id: number, formData: FormData) {
  const status = (formData.get("status") as string) || "available"
  const data = {
    make: formData.get("make") as string,
    model: formData.get("model") as string,
    year: parseInt(formData.get("year") as string),
    price: formData.get("price") as string,
    marketValue: formData.get("marketValue") as string,
    mileage: parseInt(formData.get("mileage") as string),
    fuelType: formData.get("fuelType") as string,
    transmission: formData.get("transmission") as string,
    colour: formData.get("colour") as string,
    bodyType: formData.get("bodyType") as string,
    doors: parseInt(formData.get("doors") as string),
    engineSize: (formData.get("engineSize") as string) || null,
    category: formData.get("category") as string,
    description: (formData.get("description") as string) || null,
    registration: (formData.get("registration") as string) || null,
    motExpiry: (formData.get("motExpiry") as string) || null,
    images: normalizeImageUrls(JSON.parse((formData.get("images") as string) || "[]")),
    features: (formData.get("features") as string)
      ?.split("\n")
      .map((f) => f.trim())
      .filter(Boolean) || [],
    status,
    isSold: status === "sold",
    updatedAt: new Date(),
  }

  await db.update(cars).set(data).where(eq(cars.id, id))
  revalidatePath("/cars")
  revalidatePath("/dashboard")
  await revalidateStorefront(await publicIdForCar(id))
  redirect("/cars")
}

export async function deleteCar(id: number) {
  const publicId = await publicIdForCar(id)
  await db.delete(cars).where(eq(cars.id, id))
  revalidatePath("/cars")
  revalidatePath("/dashboard")
  await revalidateStorefront(publicId)
}

export async function deleteAllDummyCars() {
  await db.delete(cars).where(eq(cars.isDummy, true))
  revalidatePath("/cars")
  revalidatePath("/dashboard")
  await revalidateStorefront()
}

export async function updateCarStatus(id: number, status: string) {
  await db
    .update(cars)
    .set({ status, isSold: status === "sold", updatedAt: new Date() })
    .where(eq(cars.id, id))
  revalidatePath("/cars")
  revalidatePath("/dashboard")
  await revalidateStorefront(await publicIdForCar(id))
}

export async function toggleSold(id: number, isSold: boolean) {
  await db.update(cars).set({ isSold, updatedAt: new Date() }).where(eq(cars.id, id))
  revalidatePath("/cars")
  revalidatePath("/dashboard")
  await revalidateStorefront(await publicIdForCar(id))
}
