import { resolveAdminBaseUrl, resolveMainSiteUrl } from "@/lib/env"

export const ADMIN_SITE_URL = resolveAdminBaseUrl()

export const MAIN_SITE_URL = resolveMainSiteUrl()

export const PRODUCTION_ORIGINS = [
  "https://admin.ltyway.co.uk",
  "https://ltyway.co.uk",
] as const
