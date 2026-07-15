"use client"

import { useState, useMemo } from "react"
import type { Car } from "@/lib/db/schema"
import { CarCard } from "@/components/car-card"
import { Filters, FilterState, defaultFilters } from "@/components/filters"
import { Button } from "@/components/ui/button"
import { Car as CarIcon } from "lucide-react"

interface InventoryProps {
  cars: Car[]
}

export function Inventory({ cars }: InventoryProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [showAll, setShowAll] = useState(false)

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          car.make.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Make filter
      if (filters.make !== "all" && car.make !== filters.make) {
        return false
      }

      // Category filter
      if (filters.titleStatus !== "all" && car.category !== filters.titleStatus) {
        return false
      }

      // Body type filter
      if (filters.damageType !== "all" && car.bodyType !== filters.damageType) {
        return false
      }

      // Price range filter
      const price = Number(car.price)
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false
      }

      return true
    })
  }, [filters, cars])

  const displayedCars = showAll ? filteredCars : filteredCars.slice(0, 6)

  // Get unique makes from actual data
  const uniqueMakes = [...new Set(cars.map((c) => c.make))].sort()

  return (
    <section id="inventory" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Our Current Stock
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            All vehicles professionally repaired in our workshop and sold below market value. New stock added weekly.
          </p>
        </div>

        <Filters filters={filters} onFilterChange={setFilters} availableMakes={uniqueMakes} />

        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <CarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No vehicles match your criteria.</p>
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
