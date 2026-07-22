import type { Metadata } from "next"
import { InfoPageLayout } from "@/components/info-page-layout"
import { COMPANY_EMAIL, COMPANY_NAME } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${COMPANY_NAME} — how we handle your contact information.`,
}

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Privacy Policy">
      <p>
        {COMPANY_NAME} (&quot;we&quot;, &quot;us&quot;) operates ltyway.co.uk. This policy explains how we
        handle information when you contact us or browse our website.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Contact details you provide via WhatsApp, email, or enquiry forms (name, phone, email, message).</li>
        <li>Basic technical data such as browser type and pages visited (via analytics in production).</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to enquiries about vehicles or recovery services.</li>
        <li>To arrange viewings, collection, or delivery.</li>
        <li>To improve our website and stock presentation.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We do not sell your data. We only share information where required by law or with service
        providers that help us run the website (e.g. hosting, image storage).
      </p>

      <h2>Retention</h2>
      <p>
        Enquiry messages are kept only as long as needed to deal with your request and any related
        sale.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask us what information we hold about you or request deletion by emailing{" "}
        <a href={`mailto:${COMPANY_EMAIL}`} className="text-primary hover:underline">
          {COMPANY_EMAIL}
        </a>
        .
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy:{" "}
        <a href={`mailto:${COMPANY_EMAIL}`} className="text-primary hover:underline">
          {COMPANY_EMAIL}
        </a>
      </p>
    </InfoPageLayout>
  )
}
