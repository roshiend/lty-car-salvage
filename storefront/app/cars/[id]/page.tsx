import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import Link from "next/link"
import { getCarByInternalId, getCarByPublicId } from "@/app/actions/cars"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarDetailClient } from "@/components/car-detail-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { COMPANY_NAME, SITE_URL } from "@/lib/brand"
import { carPublicPath } from "@/lib/car-url"

export const dynamic = "force-dynamic"

interface CarPageProps {
  params: Promise<{ id: string }>
}

async function loadCar(slug: string) {
  if (/^\d+$/.test(slug)) {
    return getCarByInternalId(parseInt(slug, 10))
  }
  return getCarByPublicId(slug)
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { id: slug } = await params
  const car = await loadCar(slug)

  if (!car) {
    return { title: "Vehicle Not Found" }
  }

  const title = `${car.year} ${car.make} ${car.model} — £${Number(car.price).toLocaleString()}`
  const description = `${car.category} · ${car.mileage?.toLocaleString()} miles · ${car.fuelType}. Workshop-repaired salvage vehicle sold below market value by ${COMPANY_NAME}.`
  const canonical = `${SITE_URL}${carPublicPath(car)}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${COMPANY_NAME}`,
      description,
      url: canonical,
      images: car.images?.[0] ? [{ url: car.images[0], alt: title }] : undefined,
    },
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const { id: slug } = await params
  const car = await loadCar(slug)

  if (!car) {
    notFound()
  }

  if (/^\d+$/.test(slug)) {
    permanentRedirect(carPublicPath(car))
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
