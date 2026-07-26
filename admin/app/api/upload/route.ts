import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { configureCloudinary, formatUploadError, uploadImageBuffer, validateCloudinaryCredentials } from "@/lib/cloudinary"

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
])
const MAX_SIZE_MB = 4

function isAllowedImage(file: File): boolean {
  if (ALLOWED_TYPES.has(file.type)) return true
  const ext = file.name.split(".").pop()?.toLowerCase()
  return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp" || ext === "heic"
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized — sign in again." }, { status: 401 })
    }

    if (!configureCloudinary()) {
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to the admin Vercel project, then redeploy.",
        },
        { status: 503 }
      )
    }

    const credentialError = validateCloudinaryCredentials()
    if (credentialError) {
      return NextResponse.json({ error: credentialError }, { status: 503 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const urls: string[] = []

    for (const file of files) {
      if (!isAllowedImage(file)) {
        return NextResponse.json(
          {
            error: `Unsupported file "${file.name}". Use JPEG, PNG, or WebP (max ${MAX_SIZE_MB}MB).`,
          },
          { status: 400 }
        )
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          {
            error: `"${file.name}" is too large. Max ${MAX_SIZE_MB}MB per file (Vercel + free tier limit).`,
          },
          { status: 400 }
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await uploadImageBuffer(buffer)
      urls.push(result.secure_url)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json({ error: formatUploadError(error) }, { status: 500 })
  }
}
