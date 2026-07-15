import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Inventory } from "@/components/inventory"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { AboutSection } from "@/components/about-section"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { TrustBadges } from "@/components/trust-badges"
import { getCars } from "@/app/actions/cars"

export default async function Home() {
  const cars = await getCars()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <Inventory cars={cars} />
        <HowItWorks />
        <AboutSection />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
