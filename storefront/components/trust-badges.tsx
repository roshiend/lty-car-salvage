import { Award, CheckCircle, Wrench, Gavel, BadgeCheck, PoundSterling } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Gavel,
      title: "Salvage Sourced",
      description: "Bought direct from UK salvage auctions and yards",
    },
    {
      icon: Wrench,
      title: "Workshop Repaired",
      description: "Fixed in our own workshop before sale",
    },
    {
      icon: PoundSterling,
      title: "Below Market Value",
      description: "Priced lower than typical retail",
    },
    {
      icon: BadgeCheck,
      title: "MOT Included",
      description: "Sold with a fresh MOT",
    },
    {
      icon: CheckCircle,
      title: "Repair History",
      description: "We tell you what was fixed",
    },
    {
      icon: Award,
      title: "Family Business",
      description: "Deal directly with us, not a salesman",
    },
  ]

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            What We Do
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            We buy salvage cars, repair them in our workshop, and sell below market value
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm mb-1">
                {badge.title}
              </h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
