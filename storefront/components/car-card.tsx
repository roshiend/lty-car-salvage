"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Gauge, Eye, TrendingDown, Car as CarIcon, Fuel, Settings2 } from "lucide-react"
import type { Car } from "@/lib/db/schema"
import { stockStatusLabel } from "@/lib/car-status"
import { CarPhoto } from "@/components/car-photo"
import { carPublicPath } from "@/lib/car-url"

interface CarCardProps {
  car: Car
  /** Shorter image area for homepage stock grid */
  compact?: boolean
}

export function CarCard({ car, compact }: CarCardProps) {
  const categoryColor = {
    "Cat S": "bg-destructive text-destructive-foreground",
    "Cat N": "bg-accent text-accent-foreground",
    Repaired: "bg-primary text-primary-foreground",
  }

  const price = Number(car.price)
  const marketValue = Number(car.marketValue)
  const status = stockStatusLabel(car.status)
  const isSold = car.isSold || car.status === "sold"

  return (
    <Card
      className={`group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 ${isSold ? "opacity-90" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-secondary ${compact ? "aspect-[2/1]" : "aspect-[4/3]"}`}
      >
        {car.images && car.images.length > 0 ? (
          <CarPhoto
            src={car.images[0]}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CarIcon className={`text-muted-foreground ${compact ? "h-10 w-10" : "h-16 w-16"}`} />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          <Badge className={categoryColor[car.category as keyof typeof categoryColor] || "bg-secondary"}>
            {car.category}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
          <Badge className={status.className}>{status.label}</Badge>
          {!isSold && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              Below market
            </Badge>
          )}
        </div>
        {isSold && (
          <div className="absolute inset-0 bg-background/25 pointer-events-none" aria-hidden />
        )}
      </div>

      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="mb-2">
          <h3 className={`font-semibold text-foreground ${compact ? "text-base" : "text-lg"}`}>
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            {car.bodyType} - {car.colour}
          </p>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <p className={`font-bold text-primary ${compact ? "text-xl" : "text-2xl"}`}>
            £{price.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground line-through">£{marketValue.toLocaleString()}</p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            {car.mileage?.toLocaleString()} mi
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            {car.fuelType}
          </div>
          <div className="flex items-center gap-1">
            <Settings2 className="h-4 w-4" />
            {car.transmission}
          </div>
        </div>
      </CardContent>

      <CardFooter className={`pt-0 gap-2 ${compact ? "p-3" : "p-4"}`}>
        <Button variant="outline" className="flex-1" asChild>
          <Link href={carPublicPath(car)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        {!isSold && (
          <Button className="flex-1" asChild>
            <Link href={`${carPublicPath(car)}#enquire`}>Enquire Now</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
