import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, MessageCircle, PoundSterling } from "lucide-react"
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact"
import { RecoveryBanner } from "@/components/recovery-banner"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Quality Salvage{" "}
            <span className="text-primary">Cars Repaired</span>
            {" "}&amp; Ready to Drive
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            We buy cars from salvage places, repair them{" "}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 mx-0.5 rounded-full bg-primary/10 border border-primary/20 text-base font-medium text-primary align-middle">
              <Wrench className="h-3.5 w-3.5 shrink-0" />
              in our own workshop
            </span>
            , and sell them{" "}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 mx-0.5 rounded-full bg-primary/10 border border-primary/20 text-base font-medium text-primary align-middle">
              <PoundSterling className="h-3.5 w-3.5 shrink-0" />
              below market value
            </span>
            . No big dealership markups — just honest cars at fair prices.
          </p>

          <RecoveryBanner className="mb-10 max-w-4xl mx-auto" />

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8" asChild>
              <Link href="#inventory">Browse Our Stock</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 gap-2" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp: {WHATSAPP_DISPLAY}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
