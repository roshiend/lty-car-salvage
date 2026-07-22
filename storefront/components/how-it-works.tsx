import { Gavel, Wrench, CheckCircle, Car } from "lucide-react"

const steps = [
  {
    icon: Gavel,
    title: "We Buy",
    description:
      "We source cars from UK salvage auctions and yards, choosing vehicles we can repair properly.",
  },
  {
    icon: Wrench,
    title: "We Repair",
    description:
      "Each car is repaired in our own workshop before it is listed for sale.",
  },
  {
    icon: CheckCircle,
    title: "We Prepare",
    description:
      "Every car is checked over and serviced before it goes on sale.",
  },
  {
    icon: Car,
    title: "You Save",
    description: "Because we buy and repair ourselves, you pay below typical retail — no dealer markups.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From salvage yard to your driveway — four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border" />
              )}

              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary mb-2">Step {index + 1}</span>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
