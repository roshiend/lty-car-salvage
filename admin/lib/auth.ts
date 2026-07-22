import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { Pool } from "pg"
import { isAllowedAdminEmail } from "@/lib/admin-access"
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

function rejectUnauthorizedEmail(email: string | null | undefined): void {
  if (!isAllowedAdminEmail(email)) {
    throw new APIError("FORBIDDEN", {
      message: "This Google account is not authorised for admin access.",
    })
  }
}

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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          rejectUnauthorizedEmail(user.email)
          return { data: user }
        },
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.endsWith("/callback/google")) return

      const newSession = ctx.context.newSession
      if (newSession) {
        rejectUnauthorizedEmail(newSession.user.email)
      }
    }),
  },
})

export { MAIN_SITE_URL }
