import { cleanEnv } from "@/lib/env"

const DEFAULT_ALLOWED_EMAIL = "lty.housereboot@gmail.com"

export function getAllowedAdminEmails(): string[] {
  const raw = cleanEnv(process.env.ADMIN_ALLOWED_EMAILS)
  if (raw) {
    return raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  }
  return [DEFAULT_ALLOWED_EMAIL]
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAllowedAdminEmails().includes(email.trim().toLowerCase())
}
