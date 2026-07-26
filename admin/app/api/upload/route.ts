import { put } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import sharp from "sharp"
import { auth } from "@/lib/auth"
import { MAIN_SITE_URL } from "@/lib/site"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE_MB = 10

const UPLOAD_DIR =
  process.env.UPLOAD_DIR ||
  path.join(process.cwd(), "..", "storefront", "public", "uploads")

async function requireAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return null
  }
  return session.user
}

async function saveLocal(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true })
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`
  await writeFile(path.join(UPLOAD_DIR, filename), buffer)
  return `${MAIN_SITE_URL}/uploads/${filename}`
}

async function saveBlob(file: File): Promise<string> {
  const inputBuffer = Buffer.from(await file.arrayBuffer())
  const optimized = await sharp(inputBuffer)
    .rotate()
    .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()

  const blob = await put(
    `cars/${Date.now()}-${file.name.replace(/\.[^.]+$/, "")}.webp`,
    optimized,
    { access: "public", contentType: "image/webp" }
  )
  return blob.url
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdminSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
    const urls: string[] = []

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 })
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large (max ${MAX_SIZE_MB}MB)` },
          { status: 400 }
        )
      }

      const url = useBlob ? await saveBlob(file) : await saveLocal(file)
      urls.push(url)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
