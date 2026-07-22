import { Button } from "@/components/ui/button"
import { Truck, MessageCircle } from "lucide-react"
import { whatsappUrl } from "@/lib/contact"
import { cn } from "@/lib/utils"

interface RecoveryBannerProps {
  className?: string
}

export function RecoveryBanner({ className }: RecoveryBannerProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-accent/25 via-accent/10 to-card p-5 sm:p-6 lg:p-8 text-left shadow-lg shadow-accent/10 ring-1 ring-accent/20 sm:flex sm:items-center sm:justify-between sm:gap-8",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/20 border-2 border-accent/40">
          <Truck className="h-7 w-7 text-accent" />
        </div>
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-foreground bg-accent px-2.5 py-0.5 rounded-full mb-2">
            Also Available
          </span>
          <p className="text-sm font-semibold text-accent uppercase tracking-wide">
            Car Recovery
          </p>
          <p className="mt-1 text-base sm:text-xl font-bold text-foreground text-balance">
            Northwest England car recovery at competitive prices
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Local recovery across the Northwest — fast, reliable, and fairly priced.
          </p>
        </div>
      </div>
      <Button
        size="lg"
        className="mt-5 sm:mt-0 w-full sm:w-auto shrink-0 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
        asChild
      >
        <a
          href={whatsappUrl("Hi, I'd like a quote for car recovery in Northwest England.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-4 w-4" />
          Get a quote
        </a>
      </Button>
    </div>
  )
}
