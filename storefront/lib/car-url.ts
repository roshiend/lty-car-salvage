/** Public storefront path for a vehicle (non-guessable id). */
export function carPublicPath(car: { publicId?: string | null; id?: number }): string {
  if (car.publicId) {
    return `/cars/${car.publicId}`
  }
  if (process.env.NODE_ENV === "development") {
    console.warn("Car missing publicId — run pnpm migrate:public-id in storefront/", car)
  }
  return "/#inventory"
}
