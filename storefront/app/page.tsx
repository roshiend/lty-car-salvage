import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Inventory } from "@/components/inventory"
import { HowItWorks } from "@/components/how-it-works"
import { AboutSection } from "@/components/about-section"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { LocalBusinessJsonLd } from "@/components/local-business-jsonld"
import { getCars } from "@/app/actions/cars"

export const dynamic = "force-dynamic"

export default async function Home() {
  const cars = await getCars()

  return (
    <div className="min-h-screen bg-background">
      <LocalBusinessJsonLd />
      <Header />
      <main>
        <Hero />
        <Inventory cars={cars} />
        <HowItWorks />
        <AboutSection />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
