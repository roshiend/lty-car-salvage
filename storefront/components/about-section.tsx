import { cn } from "@/lib/utils"
import {
  Wrench,
  ShieldCheck,
  Car,
  MessageCircle,
  ShieldX,
  FileWarning,
  BadgeCheck,
} from "lucide-react"

const disclosures = [
  {
    icon: ShieldX,
    label: "No HPI clear",
    className: "bg-destructive/15 border-destructive/35 text-destructive",
  },
  {
    icon: FileWarning,
    label: "Some vehicles may not have a complete service history",
    className: "bg-accent/20 border-accent/40 text-accent",
  },
  {
    icon: Wrench,
    label: "Every vehicle is serviced by us before sale",
    className: "bg-primary/15 border-primary/35 text-primary",
  },
  {
    icon: BadgeCheck,
    label: "All vehicles are sold with a valid MOT",
    className: "bg-sky-500/15 border-sky-500/35 text-sky-400",
  },
]

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Salvage category shown",
    description:
      "Each listing shows the salvage category (Cat S or Cat N) so you know what you are buying.",
  },
  {
    icon: Car,
    title: "Viewings, collection & delivery",
    description:
      "Viewings welcome by appointment. Collect in person, or ask us about delivery — charges apply.",
  },
  {
    icon: MessageCircle,
    title: "Deal with us directly",
    description:
      "WhatsApp or email — you speak to the people who source and prepare the cars.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-12 lg:gap-16">
          <div className="lg:flex-1 flex flex-col">
            <span className="text-sm font-medium text-primary mb-2 block">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              <span className="whitespace-nowrap">Local Workshop.</span>{" "}
              <span className="whitespace-nowrap">Honest Cars.</span>{" "}
              <span className="whitespace-nowrap">No Nonsense.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We&apos;re a workshop-based seller, not a dealer forecourt. When you get in touch, you
              deal with the people who actually handle the cars. No sales team, no pressure.
            </p>

            <div className="mt-8 pt-8 border-t border-border lg:mt-auto">
              <p className="text-sm font-semibold text-foreground mb-4">
                Important to know before you buy
              </p>
              <div className="flex flex-wrap gap-2">
                {disclosures.map((item) => (
                  <span
                    key={item.label}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium",
                      item.className
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:flex-1 flex flex-col min-h-0">
            <div className="rounded-2xl border border-border bg-background/50 p-6 md:p-8 flex flex-col flex-1 min-h-full">
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-foreground mb-6">What you can count on</h3>
                <ul className="space-y-5 flex-1">
                {trustPoints.map((point) => (
                  <li key={point.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <point.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{point.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </li>
                ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
