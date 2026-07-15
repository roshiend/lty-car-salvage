import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, PoundSterling, Truck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Salvage Sourced · Workshop Repaired
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Quality <span className="text-primary">Salvage Cars</span> Repaired
            &amp; Ready to Drive
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            We buy cars from salvage places, repair them in our own workshop, and sell them below market value. No big dealership markups — just honest cars at fair prices.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="h-12 px-8" asChild>
              <Link href="#inventory">Browse Our Stock</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8" asChild>
              <a href="tel:01212345678">Call Us: 0121 234 5678</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card border border-border">
              <PoundSterling className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">Up to 40%</p>
                <p className="text-sm text-muted-foreground">Below Market Value</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Wrench className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">In-House</p>
                <p className="text-sm text-muted-foreground">Workshop Repairs</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Truck className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">UK Wide</p>
                <p className="text-sm text-muted-foreground">Delivery Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
