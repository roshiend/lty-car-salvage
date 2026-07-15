import { Users, Heart, Wrench } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-medium text-primary mb-2 block">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Salvage Cars, Properly Repaired
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We&apos;re a family-run business in the West Midlands. We don&apos;t run a big showroom or employ pushy sales staff — we buy cars from salvage places, repair them ourselves, and sell them below market value.
              </p>
              <p>
                Every car goes through our own workshop before it&apos;s listed. We&apos;re upfront about what&apos;s been repaired, and we&apos;re happy to talk you through the work if you want to know more.
              </p>
              <p>
                You deal directly with the people who source and fix the cars. Viewings are welcome, questions are encouraged, and there&apos;s no pressure — just straight answers about what you&apos;re buying.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">Family</p>
                <p className="text-sm text-muted-foreground">Owned &amp; Run</p>
              </div>
              <div className="text-center">
                <Wrench className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">In-House</p>
                <p className="text-sm text-muted-foreground">Workshop</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">Honest</p>
                <p className="text-sm text-muted-foreground">Pricing</p>
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
                  The people who buy, repair, and sell every car on this site
                </p>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-semibold">Viewings Welcome</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
