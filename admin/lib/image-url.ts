/** Trim and drop empty image URLs before saving. */
export function normalizeImageUrls(urls: string[]): string[] {
  return urls.map((u) => u.trim()).filter(Boolean)
}

export function isCloudinaryUrl(url: string): boolean {
  try {
    const host = new URL(url.trim()).hostname
    return host === "res.cloudinary.com"
  } catch {
    return false
  }
}
