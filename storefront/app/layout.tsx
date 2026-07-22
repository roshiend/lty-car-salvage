import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { COMPANY_NAME, SITE_URL } from "@/lib/brand"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY_NAME} - Salvage Cars Repaired & Sold Below Market Value`,
    template: `%s | ${COMPANY_NAME}`,
  },
  description:
    "We buy cars from salvage places, repair them in our workshop, and sell below market value. Browse our stock of workshop-repaired vehicles.",
  icons: {
    icon: "/logo-32.webp",
    apple: "/logo-180.webp",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: COMPANY_NAME,
    title: `${COMPANY_NAME} - Salvage Cars Repaired & Sold Below Market Value`,
    description:
      "Workshop-repaired salvage cars sold below market value. View our stock or message us on WhatsApp.",
    images: [{ url: "/logo-180.webp", width: 180, height: 180, alt: `${COMPANY_NAME} logo` }],
  },
  twitter: {
    card: "summary",
    title: `${COMPANY_NAME} - Salvage Cars Repaired & Sold Below Market Value`,
    description:
      "Workshop-repaired salvage cars sold below market value. View our stock or message us on WhatsApp.",
    images: ["/logo-180.webp"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
