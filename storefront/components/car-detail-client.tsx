"use client"

import { useState } from "react"
import type { Car } from "@/lib/db/schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Gauge,
  Fuel,
  Settings2,
  Calendar,
  Car as CarIcon,
  Palette,
  DoorOpen,
  TrendingDown,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react"

interface CarDetailClientProps {
  car: Car
}

export function CarDetailClient({ car }: CarDetailClientProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [enquirySubmitted, setEnquirySubmitted] = useState(false)

  const images = car.images && car.images.length > 0 ? car.images : []
  const price = Number(car.price)
  const marketValue = Number(car.marketValue)
  const savings = marketValue - price
  const savingsPercent = Math.round((savings / marketValue) * 100)

  const categoryColor = {
    "Cat S": "bg-destructive text-destructive-foreground",
    "Cat N": "bg-accent text-accent-foreground",
    "Repaired": "bg-primary text-primary-foreground",
  }

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send an email or save to database
    setEnquirySubmitted(true)
  }

  const specs = [
    { icon: Gauge, label: "Mileage", value: `${car.mileage?.toLocaleString()} miles` },
    { icon: Fuel, label: "Fuel Type", value: car.fuelType },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: CarIcon, label: "Body Type", value: car.bodyType },
    { icon: Palette, label: "Colour", value: car.colour },
    { icon: DoorOpen, label: "Doors", value: car.doors?.toString() },
    { icon: Calendar, label: "Year", value: car.year?.toString() },
    ...(car.engineSize ? [{ icon: Settings2, label: "Engine", value: car.engineSize }] : []),
    ...(car.motExpiry
      ? [{ icon: Calendar, label: "MOT Until", value: new Date(car.motExpiry).toLocaleDateString("en-GB") }]
      : []),
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Images & Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Image Gallery */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="relative aspect-[16/10] bg-secondary">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImage]}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImage(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImage ? "bg-primary" : "bg-foreground/30"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CarIcon className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="p-4 flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    idx === currentImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Specifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Vehicle Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <spec.icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="font-medium text-foreground">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {car.description && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">About This Vehicle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{car.description}</p>
              <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                This is a previously salvaged vehicle that has been repaired in our workshop. Sold below market value. Repair details available on request.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column - Pricing & Enquiry */}
      <div className="space-y-6">
        {/* Pricing Card */}
        <Card className="bg-card border-border sticky top-4">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={categoryColor[car.category as keyof typeof categoryColor] || "bg-secondary"}>
                  {car.category}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {car.year} {car.make} {car.model}
              </h1>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">
                  £{price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="line-through">
                  Market Value: £{marketValue.toLocaleString()}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="mt-2 bg-primary/10 text-primary border-primary/20"
              >
                <TrendingDown className="h-3 w-3 mr-1" />
                You save £{savings.toLocaleString()} ({savingsPercent}%)
              </Badge>
            </div>

            <div className="space-y-3 mb-6 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                Salvage vehicle — professionally repaired
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                Sold below market value
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                Fresh MOT
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                Repair details available on request
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" size="lg" asChild>
                <a href="tel:01212345678">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us: 0121 234 5678
                </a>
              </Button>
              <Button variant="outline" className="w-full" size="lg" asChild>
                <a href="mailto:info@salvageauto.co.uk">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enquiry Form */}
        <Card className="bg-card border-border" id="enquire">
          <CardHeader>
            <CardTitle className="text-foreground">Send an Enquiry</CardTitle>
          </CardHeader>
          <CardContent>
            {enquirySubmitted ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground text-sm">
                  We&apos;ve received your enquiry and will be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" required placeholder="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required placeholder="07123 456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={3}
                    placeholder="I'm interested in this vehicle..."
                    defaultValue={`Hi, I'm interested in the ${car.year} ${car.make} ${car.model}. Could you tell me more about the repairs carried out?`}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Enquiry
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
