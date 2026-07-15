import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Phone } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
          <div className="absolute inset-0 bg-card/80" />
          
          <div className="relative px-6 py-12 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Looking for a Car Below Market Value?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Browse our current stock of workshop-repaired salvage cars, or call us to ask about what&apos;s coming in next.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="#inventory">
                  View Our Stock
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <a href="tel:01212345678">
                  <Phone className="h-4 w-4" />
                  Call: 0121 234 5678
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
