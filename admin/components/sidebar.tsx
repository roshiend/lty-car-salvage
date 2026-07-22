"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Logo } from "@/components/logo"
import {
  Car,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || "http://localhost:3000"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cars", label: "Inventory", icon: Car },
]

interface SidebarProps {
  userName: string
  userEmail: string
}

function NavContent({
  pathname,
  userName,
  userEmail,
  onSignOut,
  onClose,
}: {
  pathname: string
  userName: string
  userEmail: string
  onSignOut: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <Logo subtitle="Admin Panel" compact />
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 lg:hidden" style={{ color: "var(--text-muted)" }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Navigation
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={
                active
                  ? { background: "var(--brand-bg)", color: "var(--brand)" }
                  : { color: "var(--text-secondary)" }
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </Link>
          )
        })}

        <div className="pt-3 mt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            External
          </p>
          <a
            href={mainSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-slate-50"
            style={{ color: "var(--text-secondary)" }}
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            View Main Site
          </a>
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1" style={{ background: "var(--background)" }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{userName}</p>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{userEmail}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-50"
          style={{ color: "#dc2626" }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 border-b"
        style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center gap-2.5">
          <Logo compact showName={false} />
          <span className="font-bold text-sm tracking-[0.15em]" style={{ color: "var(--text-primary)" }}>LTY Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl border transition-all hover:bg-slate-50"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(2px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className="lg:hidden fixed top-0 left-0 h-full z-50 w-72 border-r transition-transform duration-300"
        style={{
          background: "#ffffff",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-md)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <NavContent
          pathname={pathname}
          userName={userName}
          userEmail={userEmail}
          onSignOut={handleSignOut}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 border-r"
        style={{
          background: "#ffffff",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <NavContent
          pathname={pathname}
          userName={userName}
          userEmail={userEmail}
          onSignOut={handleSignOut}
        />
      </aside>
    </>
  )
}
