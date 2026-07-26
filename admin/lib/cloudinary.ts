import { v2 as cloudinary } from "cloudinary"

export const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_FOLDER?.trim() || "lty-cars"

export function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const api_key = process.env.CLOUDINARY_API_KEY?.trim()
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim()

  if (!cloud_name || !api_key || !api_secret) {
    return false
  }

  cloudinary.config({ cloud_name, api_key, api_secret, secure: true })
  return true
}

export { cloudinary }
