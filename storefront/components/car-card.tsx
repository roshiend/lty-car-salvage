"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Gauge, Eye, TrendingDown, Car as CarIcon, Fuel, Settings2 } from "lucide-react"
import type { Car } from "@/lib/db/schema"

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const categoryColor = {
    "Cat S": "bg-destructive text-destructive-foreground",
    "Cat N": "bg-accent text-accent-foreground",
    "Repaired": "bg-primary text-primary-foreground",
  }

  const price = Number(car.price)
  const marketValue = Number(car.marketValue)
  const savings = marketValue - price
  const savingsPercent = Math.round((savings / marketValue) * 100)

  return (
    <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[0]}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CarIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={categoryColor[car.category as keyof typeof categoryColor] || "bg-secondary"}>
            {car.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            <TrendingDown className="h-3 w-3 mr-1" />
            Save {savingsPercent}%
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-foreground">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            {car.bodyType} - {car.colour}
          </p>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-2xl font-bold text-primary">
            £{price.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground line-through">
            £{marketValue.toLocaleString()}
          </p>
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

      <CardFooter className="p-4 pt-0 gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/cars/${car.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        <Button className="flex-1" asChild>
          <Link href={`/cars/${car.id}#enquire`}>Enquire Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
