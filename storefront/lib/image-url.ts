/** Extract Google Drive file id from common share / embed link formats. */
export function extractGoogleDriveFileId(url: string): string | null {
  try {
    const trimmed = url.trim()
    const u = new URL(trimmed)
    const host = u.hostname.replace(/^www\./, "")

    if (host === "drive.google.com") {
      const pathId = u.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
      if (pathId) return pathId
      const queryId = u.searchParams.get("id")
      if (queryId) return queryId
    }

    if (host === "docs.google.com") {
      const pathId = u.pathname.match(/\/d\/([^/]+)/)?.[1]
      if (pathId) return pathId
    }

    return null
  } catch {
    return null
  }
}

/** Direct view URL for embedding (file must be shared: anyone with the link). */
export function normalizeImageUrl(url: string): string {
  const trimmed = url.trim()
  const id = extractGoogleDriveFileId(trimmed)
  if (id) {
    return `https://drive.google.com/uc?export=view&id=${id}`
  }
  return trimmed
}

export function isGoogleDriveImageUrl(url: string): boolean {
  const normalized = normalizeImageUrl(url)
  return (
    normalized.includes("drive.google.com") ||
    normalized.includes("googleusercontent.com")
  )
}
