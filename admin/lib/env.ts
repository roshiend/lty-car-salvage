/** Trim whitespace and accidental extra lines from Vercel env values. */
export function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined
  const firstLine = value.trim().split(/\r?\n/)[0]?.trim()
  if (!firstLine) return undefined
  // Guard against pasting "GOOGLE_CLIENT_SECRET=..." into the client id field.
  if (firstLine.includes("=") && firstLine.toUpperCase().includes("SECRET")) {
    return undefined
  }
  return firstLine
}

export function resolveAdminBaseUrl(): string {
  const fromEnv =
    cleanEnv(process.env.NEXT_PUBLIC_BETTER_AUTH_URL) ??
    cleanEnv(process.env.BETTER_AUTH_URL)
  if (fromEnv && !fromEnv.includes(".vercel.app")) return fromEnv
  if (process.env.NODE_ENV === "development") return "http://localhost:3001"
  return "https://admin.ltyway.co.uk"
}

export function getGoogleClientId(): string {
  return cleanEnv(process.env.GOOGLE_CLIENT_ID) ?? ""
}

export function getGoogleClientSecret(): string {
  return cleanEnv(process.env.GOOGLE_CLIENT_SECRET) ?? ""
}

/** Like cleanEnv but safe for API secrets (no false reject on the word SECRET). */
export function cleanSecretEnv(value: string | undefined): string | undefined {
  if (!value) return undefined
  const firstLine = value.trim().split(/\r?\n/)[0]?.trim()
  return firstLine || undefined
}

export function getCloudinaryCloudName(): string {
  return cleanEnv(process.env.CLOUDINARY_CLOUD_NAME) ?? ""
}

export function getCloudinaryApiKey(): string {
  return cleanEnv(process.env.CLOUDINARY_API_KEY) ?? ""
}

export function getCloudinaryApiSecret(): string {
  return cleanSecretEnv(process.env.CLOUDINARY_API_SECRET) ?? ""
}

/** Optional single-line config: cloudinary://API_KEY:API_SECRET@CLOUD_NAME */
export function getCloudinaryUrl(): string {
  return cleanSecretEnv(process.env.CLOUDINARY_URL) ?? ""
}

export function resolveMainSiteUrl(): string {
  const fromEnv = cleanEnv(process.env.NEXT_PUBLIC_MAIN_SITE_URL)
  if (fromEnv && !fromEnv.includes(".vercel.app")) return fromEnv
  if (process.env.NODE_ENV === "development") return "http://localhost:3000"
  return "https://ltyway.co.uk"
}
