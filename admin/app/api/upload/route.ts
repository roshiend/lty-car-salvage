import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { cloudinary, CLOUDINARY_FOLDER, configureCloudinary } from "@/lib/cloudinary"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_SIZE_MB = 10

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!configureCloudinary()) {
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on Vercel.",
        },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const urls: string[] = []

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Use JPEG, PNG, or WebP.` },
          { status: 400 }
        )
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large (max ${MAX_SIZE_MB}MB on Cloudinary free tier).` },
          { status: 400 }
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: CLOUDINARY_FOLDER,
        resource_type: "image",
        // Keeps bandwidth/storage reasonable on the free plan
        transformation: [{ width: 1920, height: 1920, crop: "limit" }, { quality: "auto:good" }],
      })

      urls.push(result.secure_url)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
