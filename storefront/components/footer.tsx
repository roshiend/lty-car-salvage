import Link from "next/link"
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react"
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact"
import { COMPANY_EMAIL } from "@/lib/brand"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Workshop-repaired salvage cars sold below market value. Previously salvaged vehicles —
              sold as seen, with repair details available on request.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#inventory" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Our Stock
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Information</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/cat-s-and-n" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cat S &amp; Cat N Explained
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Before You Buy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 mt-0.5 text-primary" />
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  WhatsApp: {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-foreground transition-colors">
                  {COMPANY_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mt-0.5 text-primary" />
                <span>Mon-Sat 9am-6pm</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>
                  Unit 5, Industrial Estate<br />
                  Birmingham, B15 2TT
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} LTY. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
