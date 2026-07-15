import type { Metadata } from "next"
import "./globals.css"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "LTY Cars Admin",
  description: "LTY Car Salvage — Admin Panel",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
