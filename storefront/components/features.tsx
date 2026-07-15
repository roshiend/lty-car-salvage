import { Shield, Eye, BadgePoundSterling, Headphones, FileText, Award } from "lucide-react"

const features = [
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "We show you exactly what repairs were done. No hidden surprises - just honest information.",
  },
  {
    icon: BadgePoundSterling,
    title: "Below Market Value",
    description:
      "Save 40% or more compared to retail prices on quality vehicles.",
  },
  {
    icon: Shield,
    title: "3 Month Warranty",
    description:
      "All our vehicles come with a 3 month mechanical warranty for peace of mind.",
  },
  {
    icon: FileText,
    title: "HPI Clear",
    description:
      "Every car is HPI checked with no outstanding finance or stolen markers.",
  },
  {
    icon: Headphones,
    title: "Personal Service",
    description:
      "Speak directly with the people who repair the cars. We&apos;re always happy to answer questions.",
  },
  {
    icon: Award,
    title: "MOT Included",
    description:
      "All vehicles are sold with a fresh MOT. Drive away with confidence.",
  },
]

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Honest Cars, Fair Prices
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            We&apos;re a small team who take pride in our work. Every car is repaired to a high standard and sold at a fair price.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
