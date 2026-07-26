/** Public storefront path for a vehicle (non-guessable id). */
export function carPublicPath(car: { publicId: string }): string {
  return `/cars/${car.publicId}`
}
