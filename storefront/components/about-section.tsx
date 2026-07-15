import { Users, Award, Heart } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-medium text-primary mb-2 block">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              A Family Business Built on Trust
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We&apos;re a small, family-run business based in the West Midlands. What started as a passion 
                for cars has grown into a trusted local business helping everyday people get quality 
                vehicles at prices they can actually afford.
              </p>
              <p>
                We personally attend UK insurance auctions, carefully selecting vehicles with the best 
                potential. Every car is repaired in our own workshop by our experienced team using quality 
                parts. We don&apos;t cut corners — your safety is our priority.
              </p>
              <p>
                Unlike big dealerships, you&apos;ll deal directly with us. We&apos;re happy to show you around, 
                explain our repair process, and answer any questions. No pressure sales, just honest advice.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">Family</p>
                <p className="text-sm text-muted-foreground">Owned &amp; Run</p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">10+ Yrs</p>
                <p className="text-sm text-muted-foreground">Experience</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Passion</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-secondary/50 border border-border flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">Meet the Team</p>
                <p className="text-sm text-muted-foreground">
                  Your photo here — add a friendly team photo to build trust with customers
                </p>
              </div>
            </div>
            
            {/* Trust indicator */}
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-semibold">Viewings Welcome</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
