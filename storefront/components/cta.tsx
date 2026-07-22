import { RecoveryBanner } from "@/components/recovery-banner"

export function CTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <RecoveryBanner className="max-w-4xl mx-auto" />
      </div>
    </section>
  )
}
