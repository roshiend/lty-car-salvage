import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getCarById } from "@/app/actions/cars"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarDetailClient } from "@/components/car-detail-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { COMPANY_NAME, SITE_URL } from "@/lib/brand"

export const dynamic = "force-dynamic"

interface CarPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { id } = await params
  const car = await getCarById(parseInt(id))

  if (!car) {
    return { title: "Vehicle Not Found" }
  }

  const title = `${car.year} ${car.make} ${car.model} — £${Number(car.price).toLocaleString()}`
  const description = `${car.category} · ${car.mileage?.toLocaleString()} miles · ${car.fuelType}. Workshop-repaired salvage vehicle sold below market value by ${COMPANY_NAME}.`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${COMPANY_NAME}`,
      description,
      url: `${SITE_URL}/cars/${car.id}`,
      images: car.images?.[0] ? [{ url: car.images[0], alt: title }] : undefined,
    },
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params
  const car = await getCarById(parseInt(id))

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/#inventory">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stock
            </Link>
          </Button>
        </div>

        {car.isSold && (
          <div className="mb-6">
            <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2">
              This vehicle has been sold
            </Badge>
          </div>
        )}

        <CarDetailClient car={car} />
      </main>
      <Footer />
    </div>
  )
}
