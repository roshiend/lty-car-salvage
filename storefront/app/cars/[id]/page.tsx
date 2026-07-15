import { notFound } from "next/navigation"
import Link from "next/link"
import { getCarById, getCars } from "@/app/actions/cars"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarDetailClient } from "@/components/car-detail-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface CarPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const cars = await getCars()
  return cars.map((car) => ({
    id: car.id.toString(),
  }))
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
