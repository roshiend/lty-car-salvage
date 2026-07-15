"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Car } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Car as CarIcon, LogOut, Pencil, Trash2, Eye } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { CarForm } from "./car-form"
import { deleteCar, toggleCarSold } from "@/app/actions/cars"
import Link from "next/link"

interface AdminDashboardProps {
  cars: Car[]
  userName: string
}

export function AdminDashboard({ cars, userName }: AdminDashboardProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  const handleEdit = (car: Car) => {
    setEditingCar(car)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this car?")) return
    setDeleting(id)
    await deleteCar(id)
    router.refresh()
    setDeleting(null)
  }

  const handleToggleSold = async (id: number, currentStatus: boolean) => {
    await toggleCarSold(id, !currentStatus)
    router.refresh()
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCar(null)
    router.refresh()
  }

  const availableCars = cars.filter((c) => !c.isSold).length
  const soldCars = cars.filter((c) => c.isSold).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-primary">
              SalvageAuto
            </Link>
            <Badge variant="secondary">Admin</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">
              Welcome, {userName}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CarIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Cars</p>
                  <p className="text-2xl font-bold text-foreground">
                    {cars.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CarIcon className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Available</p>
                  <p className="text-2xl font-bold text-foreground">
                    {availableCars}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <CarIcon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Sold</p>
                  <p className="text-2xl font-bold text-foreground">
                    {soldCars}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Car Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Manage Inventory
          </h2>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Car
          </Button>
        </div>

        {/* Car Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
            <div className="w-full max-w-2xl mx-4">
              <CarForm car={editingCar} onClose={handleFormClose} />
            </div>
          </div>
        )}

        {/* Cars List */}
        {cars.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <CarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No cars in inventory
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your first car to get started
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Car
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cars.map((car) => (
              <Card
                key={car.id}
                className={`bg-card border-border ${car.isSold ? "opacity-60" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-48 h-32 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      {car.images && car.images.length > 0 ? (
                        <img
                          src={car.images[0]}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CarIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {car.year} {car.make} {car.model}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                car.category === "Cat S"
                                  ? "destructive"
                                  : car.category === "Cat N"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {car.category}
                            </Badge>
                            {car.isSold && (
                              <Badge className="bg-accent text-accent-foreground">
                                SOLD
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            £{Number(car.price).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground line-through">
                            Market: £{Number(car.marketValue).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <span>{car.mileage?.toLocaleString()} miles</span>
                        <span>{car.fuelType}</span>
                        <span>{car.transmission}</span>
                        <span>{car.colour}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={car.isSold ? "default" : "outline"}
                          onClick={() =>
                            handleToggleSold(car.id, car.isSold ?? false)
                          }
                        >
                          {car.isSold ? "Mark Available" : "Mark as Sold"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(car)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/cars/${car.id}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(car.id)}
                          disabled={deleting === car.id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deleting === car.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
