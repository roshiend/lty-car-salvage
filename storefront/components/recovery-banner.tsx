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
        "w-full min-w-0 overflow-hidden rounded-xl sm:rounded-2xl border-2 border-accent/50",
        "bg-gradient-to-br from-accent/25 via-accent/10 to-card",
        "p-4 sm:p-6 md:p-8 lg:p-10",
        "text-left shadow-lg shadow-accent/10 ring-1 ring-accent/20",
        "flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10",
        className
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
        <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-accent/20 border-2 border-accent/40">
          <Truck className="h-5 w-5 sm:h-7 sm:w-7 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-accent-foreground bg-accent px-2 py-0.5 sm:px-2.5 rounded-full mb-1.5 sm:mb-2">
            Also Available
          </span>
          <p className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wide">
            Vehicle Recovery
          </p>
          <p className="mt-1 font-bold text-foreground leading-snug text-pretty text-[0.9375rem] sm:text-base lg:text-lg lg:whitespace-nowrap">
            North West England & North Wales vehicle recovery at competitive prices
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground text-pretty leading-relaxed">
            <span className="sm:hidden">Fast, reliable, and fairly priced.</span>
            <span className="hidden sm:inline">
              Local recovery across North West England and North Wales — fast, reliable, and fairly
              priced.
            </span>
          </p>
        </div>
      </div>
      <Button
        size="lg"
        className="w-full lg:w-auto shrink-0 h-11 sm:h-12 px-6 sm:px-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
        asChild
      >
        <a
          href={whatsappUrl(
            "Hi, I'd like to request vehicle recovery in North West England or North Wales."
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          Request Recovery
        </a>
      </Button>
    </div>
  )
}
