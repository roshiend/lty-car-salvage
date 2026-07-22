import type { Metadata } from "next"
import { InfoPageLayout } from "@/components/info-page-layout"
import { COMPANY_NAME } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Cat S & Cat N Explained",
  description: "Understand salvage categories Cat S and Cat N when buying a repaired vehicle.",
}

export default function CatSandNPage() {
  return (
    <InfoPageLayout title="Cat S & Cat N Explained">
      <p>
        When a car has been in an accident or written off by an insurer, it is given a salvage
        category. This helps buyers understand the type of damage and how the car can be used again.
      </p>

      <h2>Cat N (Non-structural damage)</h2>
      <p>
        The damage did not affect the structural frame. Repairs typically involve body panels,
        cosmetics, or mechanical parts. After proper repair, the car can be returned to the road.
      </p>

      <h2>Cat S (Structural damage)</h2>
      <p>
        The vehicle&apos;s structural frame was damaged. These cars can be repaired and put back on
        the road, but the work must be carried out properly. We only sell Cat S vehicles we are
        confident have been repaired to a roadworthy standard.
      </p>

      <h2>Repaired</h2>
      <p>
        Some of our stock is listed as Repaired — meaning salvage history applies but the vehicle has
        been through our workshop and is ready for sale. Ask us for details of what was fixed.
      </p>

      <h2>What this means when buying from {COMPANY_NAME}</h2>
      <ul>
        <li>Every car has a salvage history — we do not hide it.</li>
        <li>We tell you the category and what repairs we have carried out.</li>
        <li>Vehicles are not HPI clear.</li>
        <li>Viewings are welcome before you commit.</li>
      </ul>
    </InfoPageLayout>
  )
}
