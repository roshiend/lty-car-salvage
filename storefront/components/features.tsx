import { Eye, BadgePoundSterling, Headphones, Award, Gavel, Wrench } from "lucide-react"

const features = [
  {
    icon: Gavel,
    title: "Salvage Sourced",
    description:
      "We buy cars from UK salvage auctions and salvage yards, selecting vehicles we can repair properly and sell at a fair price.",
  },
  {
    icon: Wrench,
    title: "Workshop Repaired",
    description:
      "Every car is repaired in our own workshop before it goes on sale. We do the work ourselves — we don't just broker cars.",
  },
  {
    icon: BadgePoundSterling,
    title: "Below Market Value",
    description:
      "Because we source and repair in-house, our prices sit below what you'd pay at a main dealer or forecourt.",
  },
  {
    icon: Eye,
    title: "Honest About Repairs",
    description:
      "We'll tell you what category the car was and what work we've done. Ask us anything — we'd rather you know upfront.",
  },
  {
    icon: Headphones,
    title: "Speak to Us Directly",
    description:
      "No call centre, no middleman. You talk to the people who buy and repair the cars.",
  },
  {
    icon: Award,
    title: "MOT Included",
    description:
      "Vehicles are sold with a fresh MOT so you can drive away knowing it's road-legal.",
  },
]

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Why Buy From Us?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            We buy salvage cars, fix them properly, and sell below market value. Straightforward cars, honest pricing, no nonsense.
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
