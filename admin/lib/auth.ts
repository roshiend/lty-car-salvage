import { betterAuth } from "better-auth"
import { Pool } from "pg"
import { ADMIN_SITE_URL, MAIN_SITE_URL, PRODUCTION_ORIGINS } from "@/lib/site"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const trustedOrigins = [
  ...PRODUCTION_ORIGINS,
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_MAIN_SITE_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined,
].filter((origin, index, all) => Boolean(origin) && all.indexOf(origin) === index) as string[]

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL || ADMIN_SITE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
