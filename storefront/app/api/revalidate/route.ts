import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ error: "Revalidation not configured" }, { status: 503 })
  }

  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let paths: string[] = ["/"]
  try {
    const body = await request.json()
    if (Array.isArray(body?.paths) && body.paths.every((p: unknown) => typeof p === "string")) {
      paths = body.paths
    }
  } catch {
    // default paths only
  }

  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: true, paths })
}
