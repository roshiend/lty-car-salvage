import { Gavel, Wrench, CheckCircle, Car } from 'lucide-react'

const steps = [
  {
    icon: Gavel,
    title: 'We Source',
    description: 'We purchase salvage vehicles from major UK insurance auctions, carefully selecting cars with the best repair potential.',
  },
  {
    icon: Wrench,
    title: 'We Repair',
    description: 'Our experienced technicians professionally repair each vehicle in our workshop using quality parts and proven techniques.',
  },
  {
    icon: CheckCircle,
    title: 'We Inspect',
    description: 'Every car undergoes thorough quality checks and is fully MOT tested before being added to our stock.',
  },
  {
    icon: Car,
    title: 'You Drive Away',
    description: 'Choose your car, complete the purchase, and drive away in a quality vehicle at a fraction of the market price.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How We Do It
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We handle everything from auction to your driveway. Our process ensures you get a quality vehicle at an unbeatable price.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
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
