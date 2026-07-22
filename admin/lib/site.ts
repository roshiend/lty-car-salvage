export const ADMIN_SITE_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://admin.ltyway.co.uk")

export const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://ltyway.co.uk")

export const PRODUCTION_ORIGINS = [
  "https://admin.ltyway.co.uk",
  "https://ltyway.co.uk",
] as const
