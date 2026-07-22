import type { Metadata } from "next"
import { InfoPageLayout } from "@/components/info-page-layout"
import { COMPANY_EMAIL, COMPANY_NAME } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms for purchasing vehicles from ${COMPANY_NAME}.`,
}

export default function TermsPage() {
  return (
    <InfoPageLayout title="Terms of Service">
      <p>
        These terms apply when you enquire about or purchase a vehicle from {COMPANY_NAME}. By using
        our website or contacting us, you agree to the following.
      </p>

      <h2>Vehicles sold as seen</h2>
      <p>
        Our cars are previously salvaged vehicles that have been repaired in our workshop. They are
        sold as seen. We will provide repair details on request, but you are responsible for
        inspecting the vehicle before purchase.
      </p>

      <h2>No HPI clear</h2>
      <p>
        Vehicles are not sold as HPI clear. Salvage history remains on record. We disclose the
        category (Cat S, Cat N, or Repaired) for each vehicle listed.
      </p>

      <h2>Service history</h2>
      <p>
        Some vehicles may not have a complete service history. Every vehicle is serviced by us
        before sale unless stated otherwise on the listing.
      </p>

      <h2>MOT</h2>
      <p>
        Where stated, vehicles are sold with a valid MOT at the time of sale. MOT status is shown on
        the vehicle listing where applicable.
      </p>

      <h2>Pricing &amp; payment</h2>
      <p>
        Listed prices are guide prices unless confirmed in writing. Payment terms are agreed directly
        with us before collection or delivery.
      </p>

      <h2>Delivery</h2>
      <p>
        Delivery may be arranged on request. Charges apply and will be quoted before booking.
      </p>

      <h2>Limitation</h2>
      <p>
        To the fullest extent permitted by law, {COMPANY_NAME} is not liable for indirect losses. Your
        statutory consumer rights are not affected where applicable.
      </p>

      <h2>Contact</h2>
      <p>
        Questions:{" "}
        <a href={`mailto:${COMPANY_EMAIL}`} className="text-primary hover:underline">
          {COMPANY_EMAIL}
        </a>
      </p>
    </InfoPageLayout>
  )
}
