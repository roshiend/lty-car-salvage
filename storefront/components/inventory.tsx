"use client"

import { useState, useMemo } from "react"
import type { Car } from "@/lib/db/schema"
import { CarCard } from "@/components/car-card"
import { Filters, FilterState, defaultFilters } from "@/components/filters"
import { Button } from "@/components/ui/button"
import { Car as CarIcon, MessageCircle } from "lucide-react"
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact"

interface InventoryProps {
  cars: Car[]
}

export function Inventory({ cars }: InventoryProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [showAll, setShowAll] = useState(false)

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          car.make.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      if (filters.make !== "all" && car.make !== filters.make) {
        return false
      }

      if (filters.titleStatus !== "all" && car.category !== filters.titleStatus) {
        return false
      }

      if (filters.damageType !== "all" && car.bodyType !== filters.damageType) {
        return false
      }

      const price = Number(car.price)
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false
      }

      return true
    })
  }, [filters, cars])

  const displayedCars = showAll ? filteredCars : filteredCars.slice(0, 6)
  const uniqueMakes = [...new Set(cars.map((c) => c.make))].sort()

  return (
    <section id="inventory" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Our Current Stock
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Browse workshop-repaired salvage cars below market value. New stock added as it becomes ready.
          </p>
        </div>

        {cars.length > 0 && (
          <Filters filters={filters} onFilterChange={setFilters} availableMakes={uniqueMakes} />
        )}

        {cars.length === 0 ? (
          <div className="text-center py-12 max-w-lg mx-auto">
            <CarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">No vehicles listed right now</p>
            <p className="text-muted-foreground mt-2">
              We&apos;re always buying and repairing salvage cars. Message us on WhatsApp to find out what&apos;s coming in next.
            </p>
            <Button className="mt-6 gap-2" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp: {WHATSAPP_DISPLAY}
              </a>
            </Button>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <CarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No vehicles match your filters.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setFilters(defaultFilters)}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {filteredCars.length > 6 && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : `View All ${filteredCars.length} Vehicles`}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
