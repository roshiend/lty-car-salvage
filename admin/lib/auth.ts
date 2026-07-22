import { betterAuth } from "better-auth"
import { Pool } from "pg"
import { getGoogleClientId, getGoogleClientSecret, resolveAdminBaseUrl } from "@/lib/env"
import { MAIN_SITE_URL, PRODUCTION_ORIGINS } from "@/lib/site"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const baseURL = resolveAdminBaseUrl()

const trustedOrigins = [
  ...PRODUCTION_ORIGINS,
  baseURL,
  process.env.NEXT_PUBLIC_MAIN_SITE_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined,
].filter((origin, index, all) => Boolean(origin) && all.indexOf(origin) === index) as string[]

export const auth = betterAuth({
  database: pool,
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: getGoogleClientId(),
      clientSecret: getGoogleClientSecret(),
    },
  },
})

export { MAIN_SITE_URL }
