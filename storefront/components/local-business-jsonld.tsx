import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_NAME,
  SITE_URL,
} from "@/lib/brand"
import { WHATSAPP_NUMBER } from "@/lib/contact"

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: COMPANY_NAME,
    url: SITE_URL,
    email: COMPANY_EMAIL,
    telephone: `+${WHATSAPP_NUMBER}`,
    image: `${SITE_URL}/logo-180.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_ADDRESS.line1,
      addressLocality: COMPANY_ADDRESS.city,
      postalCode: COMPANY_ADDRESS.postcode,
      addressCountry: COMPANY_ADDRESS.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: ["West Midlands", "Northwest England"],
    description:
      "Workshop-repaired salvage cars sold below market value. Car recovery also available in Northwest England.",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
