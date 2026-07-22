"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void
  filters: FilterState
  availableMakes?: string[]
}

export interface FilterState {
  search: string
  make: string
  titleStatus: string
  damageType: string
  priceRange: [number, number]
}

export const defaultFilters: FilterState = {
  search: "",
  make: "all",
  titleStatus: "all",
  damageType: "all",
  priceRange: [0, 40000],
}

const categories = ["Cat S", "Cat N", "Repaired"]
const bodyTypes = ["Hatchback", "Saloon", "Estate", "SUV", "Coupe", "Convertible", "MPV", "Van"]

export function Filters({ onFilterChange, filters, availableMakes = [] }: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleReset = () => {
    onFilterChange(defaultFilters)
  }

  const hasActiveFilters =
    filters.search !== "" ||
    filters.make !== "all" ||
    filters.titleStatus !== "all" ||
    filters.damageType !== "all" ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 40000

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-8">
      {/* Search bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by make or model..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={handleReset} className="gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-border">
          <div className="space-y-2">
            <Label>Make</Label>
            <Select
              value={filters.make}
              onValueChange={(value) => onFilterChange({ ...filters, make: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Makes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {availableMakes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.titleStatus}
              onValueChange={(value) => onFilterChange({ ...filters, titleStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Body Type</Label>
            <Select
              value={filters.damageType}
              onValueChange={(value) => onFilterChange({ ...filters, damageType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {bodyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Price Range: £{filters.priceRange[0].toLocaleString()} - £
                {filters.priceRange[1].toLocaleString()}
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  onFilterChange({ ...filters, priceRange: value as [number, number] })
                }
                min={0}
                max={40000}
                step={1000}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
