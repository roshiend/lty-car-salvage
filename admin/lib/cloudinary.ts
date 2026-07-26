import { v2 as cloudinary, type UploadApiResponse } from "cloudinary"
import { Readable } from "stream"
import {
  getCloudinaryApiKey,
  getCloudinaryApiSecret,
  getCloudinaryCloudName,
} from "@/lib/env"

export const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_FOLDER?.trim() || "lty-cars"

export function configureCloudinary(): boolean {
  const cloud_name = getCloudinaryCloudName()
  const api_key = getCloudinaryApiKey()
  const api_secret = getCloudinaryApiSecret()

  if (!cloud_name || !api_key || !api_secret) {
    return false
  }

  cloudinary.config({ cloud_name, api_key, api_secret, secure: true })
  return true
}

export function uploadImageBuffer(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error)
        else if (result) resolve(result)
        else reject(new Error("Cloudinary returned no result"))
      }
    )

    Readable.from(buffer).pipe(stream)
  })
}

export function formatUploadError(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as { message?: string; error?: { message?: string } }
    if (e.message) return e.message
    if (e.error?.message) return e.error.message
  }
  return "Upload failed"
}

export { cloudinary }
