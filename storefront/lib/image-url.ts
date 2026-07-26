export function isCloudinaryUrl(url: string): boolean {
  try {
    const host = new URL(url.trim()).hostname
    return host === "res.cloudinary.com"
  } catch {
    return false
  }
}

/** Use plain img for legacy non-Cloudinary URLs (e.g. old Google Drive links). */
export function useNativeImageTag(url: string): boolean {
  return !isCloudinaryUrl(url)
}
