"use client"

import { useState, useRef } from "react"
import { Car } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload, Loader2, Trash2 } from "lucide-react"
import { createCar, updateCar } from "@/app/actions/cars"

interface CarFormProps {
  car?: Car | null
  onClose: () => void
}

const makes = [
  "Audi", "BMW", "Ford", "Honda", "Hyundai", "Jaguar", "Kia", "Land Rover",
  "Lexus", "Mazda", "Mercedes-Benz", "Mini", "Nissan", "Peugeot", "Porsche",
  "Renault", "Seat", "Skoda", "Tesla", "Toyota", "Vauxhall", "Volkswagen", "Volvo"
]

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"]
const transmissions = ["Manual", "Automatic", "Semi-Automatic"]
const bodyTypes = ["Hatchback", "Saloon", "Estate", "SUV", "Coupe", "Convertible", "MPV", "Van"]
const categories = ["Cat S", "Cat N", "Repaired"]

export function CarForm({ car, onClose }: CarFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(car?.images || [])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    make: car?.make || "",
    model: car?.model || "",
    year: car?.year?.toString() || new Date().getFullYear().toString(),
    price: car?.price?.toString() || "",
    marketValue: car?.marketValue?.toString() || "",
    mileage: car?.mileage?.toString() || "",
    fuelType: car?.fuelType || "",
    transmission: car?.transmission || "",
    colour: car?.colour || "",
    bodyType: car?.bodyType || "",
    doors: car?.doors?.toString() || "5",
    engineSize: car?.engineSize || "",
    category: car?.category || "Cat S",
    description: car?.description || "",
    motExpiry: car?.motExpiry ? new Date(car.motExpiry).toISOString().split('T')[0] : "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const { url } = await response.json()
          setImages((prev) => [...prev, url])
        }
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index]
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      })
    } catch (error) {
      console.error("Failed to delete image:", error)
    }
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: formData.price,
        marketValue: formData.marketValue,
        mileage: parseInt(formData.mileage),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        colour: formData.colour,
        bodyType: formData.bodyType,
        doors: parseInt(formData.doors),
        engineSize: formData.engineSize || undefined,
        category: formData.category,
        description: formData.description || undefined,
        images: images,
        motExpiry: formData.motExpiry || undefined,
      }

      if (car) {
        await updateCar(car.id, data)
      } else {
        await createCar(data)
      }

      onClose()
    } catch (error) {
      console.error("Failed to save car:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">
          {car ? "Edit Car" : "Add New Car"}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div className="space-y-2">
            <Label className="text-foreground">Images</Label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                  <img src={img} alt={`Car ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive rounded-full"
                  >
                    <Trash2 className="h-3 w-3 text-destructive-foreground" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make" className="text-foreground">Make *</Label>
              <Select value={formData.make} onValueChange={(v) => handleChange("make", v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map((make) => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-foreground">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                required
                className="bg-input border-border"
                placeholder="e.g. Golf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-foreground">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                required
                min="1990"
                max={new Date().getFullYear() + 1}
                className="bg-input border-border"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">Your Price (£) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
                className="bg-input border-border"
                placeholder="8999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketValue" className="text-foreground">Market Value (£) *</Label>
              <Input
                id="marketValue"
                type="number"
                step="0.01"
                value={formData.marketValue}
                onChange={(e) => handleChange("marketValue", e.target.value)}
                required
                className="bg-input border-border"
                placeholder="12000"
              />
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-foreground">Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
                required
                className="bg-input border-border"
                placeholder="45000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelType" className="text-foreground">Fuel Type *</Label>
              <Select value={formData.fuelType} onValueChange={(v) => handleChange("fuelType", v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission" className="text-foreground">Transmission *</Label>
              <Select value={formData.transmission} onValueChange={(v) => handleChange("transmission", v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {transmissions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">Category *</Label>
              <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="colour" className="text-foreground">Colour *</Label>
              <Input
                id="colour"
                value={formData.colour}
                onChange={(e) => handleChange("colour", e.target.value)}
                required
                className="bg-input border-border"
                placeholder="Black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyType" className="text-foreground">Body Type *</Label>
              <Select value={formData.bodyType} onValueChange={(v) => handleChange("bodyType", v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doors" className="text-foreground">Doors *</Label>
              <Select value={formData.doors} onValueChange={(v) => handleChange("doors", v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5].map((d) => (
                    <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="engineSize" className="text-foreground">Engine Size</Label>
              <Input
                id="engineSize"
                value={formData.engineSize}
                onChange={(e) => handleChange("engineSize", e.target.value)}
                className="bg-input border-border"
                placeholder="2.0L"
              />
            </div>
          </div>

          {/* MOT */}
          <div className="space-y-2">
            <Label htmlFor="motExpiry" className="text-foreground">MOT Expiry</Label>
            <Input
              id="motExpiry"
              type="date"
              value={formData.motExpiry}
              onChange={(e) => handleChange("motExpiry", e.target.value)}
              className="bg-input border-border"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="bg-input border-border"
              placeholder="Add any additional details about the car..."
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {car ? "Updating..." : "Adding..."}
                </>
              ) : car ? (
                "Update Car"
              ) : (
                "Add Car"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
