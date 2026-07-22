import type { Metadata } from "next"
import { InfoPageLayout } from "@/components/info-page-layout"
import { COMPANY_NAME } from "@/lib/brand"
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact"

export const metadata: Metadata = {
  title: "FAQs",
  description: `Frequently asked questions about buying salvage cars from ${COMPANY_NAME}.`,
}

export default function FaqPage() {
  return (
    <InfoPageLayout title="Frequently Asked Questions">
      <h2>Are your cars HPI clear?</h2>
      <p>
        No. Our vehicles are not sold as HPI clear. We always disclose the salvage category on each
        listing.
      </p>

      <h2>Do you offer a warranty?</h2>
      <p>
        No. Vehicles are sold as seen. We repair them in our own workshop before sale.
      </p>

      <h2>Can I view a car before buying?</h2>
      <p>
        Yes. Viewings are welcome by appointment. Message us on WhatsApp and we&apos;ll arrange a
        convenient time.
      </p>

      <h2>Do you deliver?</h2>
      <p>
        Yes, delivery can be arranged on request. Charges apply depending on distance — ask us for
        a quote.
      </p>

      <h2>Is an MOT included?</h2>
      <p>
        Where shown on the listing, the vehicle is sold with a valid MOT. Check the individual car
        page for MOT expiry date.
      </p>

      <h2>How do I pay?</h2>
      <p>
        Payment terms are agreed directly with us. Contact us on WhatsApp ({WHATSAPP_DISPLAY}) to
        discuss a vehicle and arrange payment and collection.
      </p>

      <p>
        Still have questions?{" "}
        <a href={WHATSAPP_URL} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
          Message us on WhatsApp
        </a>
        .
      </p>
    </InfoPageLayout>
  )
}
