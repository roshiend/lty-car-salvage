import Image from "next/image"
import Link from "next/link"
import { COMPANY_NAME, LOGO_SRC } from "@/lib/brand"

interface LogoProps {
  href?: string
  showName?: boolean
  subtitle?: string
  compact?: boolean
}

export function Logo({ href, showName = true, subtitle, compact = false }: LogoProps) {
  const content = (
    <div className="flex items-center gap-3">
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl bg-black ${
          compact ? "h-9 w-9" : "h-10 w-10"
        }`}
      >
        <Image
          src={LOGO_SRC}
          alt={`${COMPANY_NAME} logo`}
          width={compact ? 36 : 40}
          height={compact ? 36 : 40}
          className="h-full w-full object-contain"
          priority
        />
      </div>
      {showName && (
        <div>
          <p
            className="font-bold tracking-[0.15em]"
            style={{ color: "var(--text-primary)", fontSize: compact ? "0.875rem" : "1rem" }}
          >
            {COMPANY_NAME}
          </p>
          {subtitle && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
