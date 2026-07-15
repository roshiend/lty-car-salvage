import { db } from "@/lib/db"
import { cars } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import {
  Car,
  TrendingUp,
  PoundSterling,
  CheckCircle,
  ArrowUpRight,
  Plus,
  Eye,
  Pencil,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { getStatus } from "@/lib/car-status"

export default async function DashboardPage() {
  const allCars = await db.select().from(cars).orderBy(desc(cars.createdAt))
  const liveCars = allCars.filter((car) => !car.isDummy)
  const dummyCars = allCars.filter((car) => car.isDummy)

  const totalCars = liveCars.length
  const availableCars = liveCars.filter((c) => (c.status ?? "available") === "available").length
  const soldCars = liveCars.filter((c) => c.status === "sold").length
  const reservedCars = liveCars.filter((c) => c.status === "reserved").length
  const reducedCars = liveCars.filter((c) => c.status === "reduced").length
  const totalValue = liveCars
    .filter((c) => c.status !== "sold")
    .reduce((acc, c) => acc + Number(c.price), 0)
  const soldValue = liveCars
    .filter((c) => c.status === "sold")
    .reduce((acc, c) => acc + Number(c.price), 0)

  const recentCars = allCars.slice(0, 6)
  const soldRate = totalCars > 0 ? Math.round((soldCars / totalCars) * 100) : 0

  const stats = [
    {
      label: "Total Cars",
      value: totalCars.toString(),
      sub: "In the system",
      icon: Car,
      iconColor: "#f97316",
      iconBg: "#fff7ed",
      borderColor: "#fed7aa",
      accent: "#f97316",
    },
    {
      label: "Available",
      value: availableCars.toString(),
      sub: `${reducedCars} reduced · ${reservedCars} reserved`,
      icon: CheckCircle,
      iconColor: "#16a34a",
      iconBg: "#f0fdf4",
      borderColor: "#bbf7d0",
      accent: "#16a34a",
    },
    {
      label: "Sold",
      value: soldCars.toString(),
      sub: `${soldRate}% sell-through`,
      icon: TrendingUp,
      iconColor: "#2563eb",
      iconBg: "#eff6ff",
      borderColor: "#bfdbfe",
      accent: "#2563eb",
    },
    {
      label: "Inventory Value",
      value: `£${totalValue.toLocaleString()}`,
      sub: `£${soldValue.toLocaleString()} sold`,
      icon: PoundSterling,
      iconColor: "#7c3aed",
      iconBg: "#f5f3ff",
      borderColor: "#ddd6fe",
      accent: "#7c3aed",
    },
  ]

  const fuelBreakdown = ["Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) => {
    const count = liveCars.filter((c) => c.fuelType === fuel).length
    return { fuel, count, pct: totalCars > 0 ? Math.round((count / totalCars) * 100) : 0 }
  }).filter((f) => f.count > 0)

  const categoryBreakdown = ["Cat S", "Cat N", "Repaired"].map((cat) => {
    const count = liveCars.filter((c) => c.category === cat).length
    return {
      cat,
      count,
      pct: totalCars > 0 ? Math.round((count / totalCars) * 100) : 0,
      color: cat === "Cat S" ? "#dc2626" : cat === "Cat N" ? "#f97316" : "#16a34a",
      bg: cat === "Cat S" ? "#fef2f2" : cat === "Cat N" ? "#fff7ed" : "#f0fdf4",
    }
  }).filter((c) => c.count > 0)

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Here's what's happening with your inventory
            {dummyCars.length > 0 && (
              <span style={{ color: "#b45309" }}>
                {" "}· {dummyCars.length} dummy listing{dummyCars.length === 1 ? "" : "s"} hidden from public
              </span>
            )}
          </p>
        </div>
        <Link
          href="/cars/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all hover:opacity-90 self-start sm:self-auto"
          style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
        >
          <Plus className="w-4 h-4" />
          Add Car
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4 lg:p-5 border"
            style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider truncate" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </p>
                <p className="text-2xl lg:text-3xl font-bold mt-2 truncate" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-1 truncate" style={{ color: "var(--text-muted)" }}>
                  {stat.sub}
                </p>
              </div>
              <div
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: stat.iconBg, border: `1px solid ${stat.borderColor}` }}
              >
                <stat.icon className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: stat.iconColor }} />
              </div>
            </div>
            {/* Progress bar */}
            {totalCars > 0 && (
              <div className="mt-3 h-1 rounded-full" style={{ background: "var(--border)" }}>
                <div
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: `${stat.label === "Sold"
                      ? soldRate
                      : stat.label === "Available"
                      ? Math.round((availableCars / totalCars) * 100)
                      : 100}%`,
                    background: stat.accent,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main content: recent cars + breakdowns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">

        {/* Recent cars - takes 2/3 width on xl */}
        <div
          className="xl:col-span-2 rounded-2xl border overflow-hidden"
          style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
        >
          <div
            className="px-5 py-4 border-b flex items-center justify-between"
            style={{ background: "#fafafa", borderColor: "var(--border)" }}
          >
            <div>
              <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Recent Listings</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Latest vehicles added</p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: "var(--brand-bg)", color: "var(--brand)" }}
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {recentCars.length === 0 ? (
            <div className="py-16 text-center">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: "var(--brand-bg)" }}
              >
                <Car className="w-7 h-7" style={{ color: "var(--brand)" }} />
              </div>
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>No cars yet</p>
              <p className="text-sm mt-1 mb-5" style={{ color: "var(--text-secondary)" }}>
                Add your first car to get started
              </p>
              <Link
                href="/cars/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
              >
                <Plus className="w-4 h-4" /> Add Car
              </Link>
            </div>
          ) : (
            <div>
              {recentCars.map((car, idx) => (
                <div
                  key={car.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                  style={{
                    borderBottom: idx < recentCars.length - 1 ? "1px solid var(--border-light)" : "none",
                    opacity: car.isSold ? 0.65 : 1,
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border"
                    style={{ background: "var(--background)", borderColor: "var(--border)" }}
                  >
                    {car.images?.[0] ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {car.year} {car.make} {car.model}
                      </p>
                      {car.isDummy && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}
                        >
                          Dummy
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                      {car.colour} · {car.fuelType} · {car.mileage?.toLocaleString()} mi
                    </p>
                  </div>

                  {/* Price + badge */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-sm font-bold" style={{ color: "var(--brand)" }}>
                      £{Number(car.price).toLocaleString()}
                    </p>
                    {(() => {
                      const s = getStatus(car.status)
                      return (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-flex items-center gap-1"
                          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                          {s.label}
                        </span>
                      )
                    })()}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/cars/${car.id}`}
                      className="p-2 rounded-lg border transition-all hover:bg-slate-100"
                      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    {!car.isDummy && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_MAIN_SITE_URL}/cars/${car.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border transition-all hover:bg-slate-100"
                        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: breakdowns */}
        <div className="flex flex-col gap-4">

          {/* Quick Actions */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="px-5 py-4 border-b" style={{ background: "#fafafa", borderColor: "var(--border)" }}>
              <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Quick Actions</h2>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <Link
                href="/cars/new"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
              >
                <Plus className="w-4 h-4" />
                Add New Car
              </Link>
              <Link
                href="/cars"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all hover:bg-slate-50"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                <Car className="w-4 h-4" />
                View All Inventory
              </Link>
              <a
                href={mainSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all hover:bg-slate-50"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                <Eye className="w-4 h-4" />
                View Main Site
              </a>
            </div>
          </div>

          {/* Fuel Breakdown */}
          {fuelBreakdown.length > 0 && (
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="px-5 py-4 border-b" style={{ background: "#fafafa", borderColor: "var(--border)" }}>
                <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Fuel Types</h2>
              </div>
              <div className="p-5 space-y-3">
                {fuelBreakdown.map(({ fuel, count, pct }) => (
                  <div key={fuel}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{fuel}</span>
                      <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                        {count} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg, #f97316, #fb923c)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {categoryBreakdown.length > 0 && (
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="px-5 py-4 border-b" style={{ background: "#fafafa", borderColor: "var(--border)" }}>
                <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Categories</h2>
              </div>
              <div className="p-5 space-y-2.5">
                {categoryBreakdown.map(({ cat, count, pct, color, bg }) => (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                      <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{cat}</span>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: bg, color }}
                    >
                      {count} car{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sell-through rate */}
          {totalCars > 0 && (
            <div
              className="rounded-2xl border p-5"
              style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Sell-through Rate</h2>
                <span className="text-xl font-bold" style={{ color: soldRate >= 50 ? "#16a34a" : "var(--brand)" }}>
                  {soldRate}%
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${soldRate}%`,
                    background: soldRate >= 50
                      ? "linear-gradient(90deg, #16a34a, #22c55e)"
                      : "linear-gradient(90deg, #f97316, #fb923c)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  <Clock className="w-3 h-3 inline mr-1" />{availableCars} available
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {soldCars} sold
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || "http://localhost:3000"
