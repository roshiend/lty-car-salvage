import { Shield, Award, FileCheck, Clock, CheckCircle, BadgeCheck } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "3 Month Warranty",
      description: "Every vehicle comes with warranty cover",
    },
    {
      icon: FileCheck,
      title: "HPI Clear",
      description: "Full history check on all vehicles",
    },
    {
      icon: BadgeCheck,
      title: "MOT Included",
      description: "Fresh MOT on every car we sell",
    },
    {
      icon: Award,
      title: "Professional Repairs",
      description: "All work done by qualified technicians",
    },
    {
      icon: CheckCircle,
      title: "Transparent Pricing",
      description: "No hidden fees or surprise costs",
    },
    {
      icon: Clock,
      title: "Family Business",
      description: "Honest, personal service every time",
    },
  ]

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Why Buy From Us?
          </h2>
          <p className="text-muted-foreground text-sm">
            We&apos;re a small family business committed to quality and honesty
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
