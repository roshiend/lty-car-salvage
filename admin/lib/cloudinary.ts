import { v2 as cloudinary, type UploadApiResponse } from "cloudinary"
import { Readable } from "stream"
import {
  getCloudinaryApiKey,
  getCloudinaryApiSecret,
  getCloudinaryCloudName,
  getCloudinaryUrl,
} from "@/lib/env"

export const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_FOLDER?.trim() || "lty-cars"

/** Catch swapped/truncated credentials before calling Cloudinary. */
export function validateCloudinaryCredentials(): string | null {
  if (getCloudinaryUrl().startsWith("cloudinary://")) {
    return null
  }

  const cloud_name = getCloudinaryCloudName()
  const api_key = getCloudinaryApiKey()
  const api_secret = getCloudinaryApiSecret()

  if (!cloud_name || !api_key || !api_secret) {
    return null
  }

  const keyIsNumeric = /^\d+$/.test(api_key)
  const secretIsNumeric = /^\d+$/.test(api_secret)

  if (!keyIsNumeric && secretIsNumeric) {
    return "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET look swapped. Key = number only; Secret = longer string from Access keys."
  }

  if (keyIsNumeric && api_secret.length < 20) {
    return "CLOUDINARY_API_SECRET looks too short — paste the full API secret from Cloudinary."
  }

  return null
}

export function configureCloudinary(): boolean {
  const cloudinaryUrl = getCloudinaryUrl()
  if (cloudinaryUrl.startsWith("cloudinary://")) {
    cloudinary.config({ cloudinary_url: cloudinaryUrl, secure: true })
    return true
  }

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
  let msg = "Upload failed"
  if (error && typeof error === "object") {
    const e = error as { message?: string; error?: { message?: string } }
    msg = e.message || e.error?.message || msg
  }

  if (msg.includes("Invalid Signature")) {
    return (
      "Invalid Cloudinary credentials (signature mismatch). In Vercel → admin project: open Cloudinary Dashboard → Settings → Access keys. " +
      "Set CLOUDINARY_CLOUD_NAME = cloud name, CLOUDINARY_API_KEY = the numeric Key, CLOUDINARY_API_SECRET = the Secret (not the key). " +
      "If unsure, click Reset secret, paste all three fresh, redeploy admin. Remove any extra CLOUDINARY_URL unless you built it as cloudinary://KEY:SECRET@CLOUD_NAME."
    )
  }

  return msg
}

export { cloudinary }
