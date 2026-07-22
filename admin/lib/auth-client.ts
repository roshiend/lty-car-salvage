import { createAuthClient } from "better-auth/react"
import { resolveAdminBaseUrl } from "@/lib/env"

export const authClient = createAuthClient({
  baseURL: resolveAdminBaseUrl(),
})
