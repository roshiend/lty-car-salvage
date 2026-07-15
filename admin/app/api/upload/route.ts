import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// Saves to the storefront's public/uploads so images are served from the main site
const UPLOAD_DIR =
  process.env.UPLOAD_DIR ||
  path.join(process.cwd(), "..", "storefront", "public", "uploads")

const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL || "http://localhost:3000"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE_MB = 10

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Ensure directory exists
    await mkdir(UPLOAD_DIR, { recursive: true })

    const urls: string[] = []

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}` },
          { status: 400 }
        )
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large (max ${MAX_SIZE_MB}MB)` },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`
      const filepath = path.join(UPLOAD_DIR, filename)

      await writeFile(filepath, buffer)
      urls.push(`${MAIN_SITE_URL}/uploads/${filename}`)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
