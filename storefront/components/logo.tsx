import Image from "next/image"
import Link from "next/link"
import { COMPANY_NAME, LOGO_SRC } from "@/lib/brand"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  showName?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: { box: "h-10 w-8", image: 40, text: "text-lg" },
  md: { box: "h-12 w-10", image: 48, text: "text-xl" },
  lg: { box: "h-16 w-12", image: 64, text: "text-2xl" },
}

export function Logo({ href = "/", showName = true, size = "lg", className }: LogoProps) {
  const s = sizes[size]

  const content = (
    <>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black",
          s.box
        )}
      >
        <Image
          src={LOGO_SRC}
          alt={`${COMPANY_NAME} logo`}
          width={s.image}
          height={s.image}
          className="h-full w-full object-contain"
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>
      {showName && (
        <span className={cn("font-bold text-foreground tracking-[0.2em]", s.text)}>
          {COMPANY_NAME}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cn("flex items-center gap-2.5", className)}>
        {content}
      </Link>
    )
  }

  return <div className={cn("flex items-center gap-2.5", className)}>{content}</div>
}
