import { createAuthClient } from "better-auth/react"
import { ADMIN_SITE_URL } from "@/lib/site"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ADMIN_SITE_URL,
})
