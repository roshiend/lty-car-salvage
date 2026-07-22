import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface InfoPageLayoutProps {
  title: string
  children: React.ReactNode
}

export function InfoPageLayout({ title, children }: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14 max-w-3xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">{title}</h1>
        <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-4 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
