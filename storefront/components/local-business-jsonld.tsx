import { COMPANY_EMAIL, COMPANY_NAME, SITE_URL } from "@/lib/brand"
import { WHATSAPP_NUMBER } from "@/lib/contact"

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    url: SITE_URL,
    email: COMPANY_EMAIL,
    telephone: `+${WHATSAPP_NUMBER}`,
    image: `${SITE_URL}/logo-180.webp`,
    description:
      "Workshop-repaired salvage cars sold below market value. Car recovery also available.",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
