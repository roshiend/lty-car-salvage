export function parseReferrerHost(referrer: string | null): string | null {
  if (!referrer) return null
  try {
    return new URL(referrer).hostname.replace(/^www\./i, "").toLowerCase()
  } catch {
    return null
  }
}

export function classifyTrafficSource(input: {
  referrer: string | null
  utmSource: string | null
  utmMedium: string | null
  hasFbclid: boolean
  hasGclid: boolean
}): { trafficSource: string; referrerHost: string | null } {
  const referrerHost = parseReferrerHost(input.referrer)
  const utmSource = (input.utmSource || "").toLowerCase().trim()
  const utmMedium = (input.utmMedium || "").toLowerCase().trim()

  if (input.hasFbclid || utmSource.includes("facebook") || utmSource === "fb" || utmSource === "meta") {
    const label =
      utmMedium.includes("cpc") || utmMedium.includes("paid") ? "Facebook Ads" : "Facebook"
    return { trafficSource: label, referrerHost }
  }

  if (input.hasGclid || utmSource.includes("google") || utmMedium.includes("cpc")) {
    return { trafficSource: "Google Ads", referrerHost }
  }

  if (utmSource) {
    return { trafficSource: `Campaign: ${input.utmSource!.trim()}`, referrerHost }
  }

  if (!referrerHost) {
    return { trafficSource: "Direct", referrerHost: null }
  }

  if (/facebook|fb\.com|m\.facebook/i.test(referrerHost)) {
    return { trafficSource: "Facebook", referrerHost }
  }
  if (/instagram/i.test(referrerHost)) {
    return { trafficSource: "Instagram", referrerHost }
  }
  if (/google\./i.test(referrerHost)) {
    return { trafficSource: "Google", referrerHost }
  }
  if (/bing\.|yahoo\.|duckduckgo/i.test(referrerHost)) {
    return { trafficSource: "Search", referrerHost }
  }
  if (/t\.co|twitter|x\.com/i.test(referrerHost)) {
    return { trafficSource: "X / Twitter", referrerHost }
  }

  return { trafficSource: "Referral", referrerHost }
}

export function formatArea(country: string | null, region: string | null, city: string | null): string {
  const parts = [city, region, country].filter(Boolean)
  if (parts.length === 0) return "Unknown area"
  return parts.join(", ")
}
