"use client"

import { useState } from "react"
import type { Car } from "@/lib/db/schema"
import { CarPhoto } from "@/components/car-photo"
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
  MessageCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { whatsappUrl } from "@/lib/contact"
import { COMPANY_EMAIL } from "@/lib/brand"

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

  const handleEnquirySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    const text = `Hi, I'm ${name}. I'm interested in the ${car.year} ${car.make} ${car.model}.

Phone: ${phone}
Email: ${email}

${message}`

    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer")
    setEnquirySubmitted(true)
  }

  const priceHighlights = [
    ...(car.motExpiry ? ["Valid MOT until " + new Date(car.motExpiry).toLocaleDateString("en-GB")] : []),
    `${car.category} category — details in specifications`,
  ]

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
                <CarPhoto
                  src={images[currentImage]}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-contain"
                  priority
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
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    idx === currentImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <CarPhoto
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
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

        {/* Description & buyer notes */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">About This Vehicle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="rounded-lg border border-border bg-card p-4"
              role="note"
              aria-label="Important buyer information"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-white shrink-0" aria-hidden />
                <p className="font-semibold text-white text-sm">
                  Important — please read before you buy
                </p>
              </div>
              <ul className="space-y-2.5">
                {[
                  "May not include a full service history",
                  "Not HPI clear",
                  "Previously salvaged vehicle",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm font-medium text-white">
                    <span className="text-white font-bold shrink-0" aria-hidden>
                      !
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            {car.description ? (
              <p className="text-muted-foreground whitespace-pre-line pt-2 border-t border-border">
                {car.description}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Right Column — single sticky pricing & enquiry card */}
      <Card className="bg-card border-border lg:sticky lg:top-4 lg:self-start" id="enquire">
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={categoryColor[car.category as keyof typeof categoryColor] || "bg-secondary"}>
                {car.category}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {car.year} {car.make} {car.model}
            </h1>
          </div>

          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-primary">£{price.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="line-through">Market Value: £{marketValue.toLocaleString()}</span>
            </div>
            <Badge
              variant="secondary"
              className="mt-2 bg-primary/10 text-primary border-primary/20"
            >
              <TrendingDown className="h-3 w-3 mr-1" />
              You save £{savings.toLocaleString()} ({savingsPercent}%)
            </Badge>
          </div>

          {priceHighlights.length > 0 ? (
            <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
              {priceHighlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          ) : null}

          {enquirySubmitted ? (
            <div className="text-center py-4 border-t border-border pt-6">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Thank you</h3>
              <p className="text-muted-foreground text-sm">
                WhatsApp should have opened with your message. You can also email us at{" "}
                <a href={`mailto:${COMPANY_EMAIL}`} className="text-primary underline">
                  {COMPANY_EMAIL}
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} className="space-y-4 border-t border-border pt-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Enquire about this vehicle</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Send your details via WhatsApp or email us below.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" required placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required placeholder="07123 456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Any questions about this car?"
                />
              </div>
              <Button type="submit" className="w-full gap-2" size="lg">
                <MessageCircle className="h-4 w-4" />
                Send enquiry on WhatsApp
              </Button>
              <Button variant="outline" className="w-full" size="lg" asChild>
                <a href={`mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(`Enquiry: ${car.year} ${car.make} ${car.model}`)}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email instead
                </a>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
