import { CheckCircle, Wrench, Gavel, BadgeCheck, PoundSterling, MessageCircle } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Gavel,
      title: "Salvage Sourced",
      description: "Direct from UK salvage auctions",
    },
    {
      icon: Wrench,
      title: "Workshop Repaired",
      description: "Fixed in-house before sale",
    },
    {
      icon: PoundSterling,
      title: "Below Market Value",
      description: "Priced lower than typical retail",
    },
    {
      icon: BadgeCheck,
      title: "MOT Included",
      description: "Where shown on listing",
    },
    {
      icon: CheckCircle,
      title: "Repair History",
      description: "Details available on request",
    },
    {
      icon: MessageCircle,
      title: "Direct Contact",
      description: "WhatsApp — no call centre",
    },
  ]

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">What We Do</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
