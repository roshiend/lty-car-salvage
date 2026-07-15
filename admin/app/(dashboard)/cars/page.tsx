import { db } from "@/lib/db"
import { cars } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { Car, Plus, Pencil, ExternalLink } from "lucide-react"
import DeleteCarButton from "@/components/delete-car-button"
import DeleteAllDummyButton from "@/components/delete-all-dummy-button"
import StatusDropdown from "@/components/status-dropdown"

export default async function CarsPage() {
  const allCars = await db.select().from(cars).orderBy(desc(cars.createdAt))
  const dummyCars = allCars.filter((car) => car.isDummy)
  const liveCars = allCars.filter((car) => !car.isDummy)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Inventory</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            {liveCars.length} live · {dummyCars.length} dummy
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DeleteAllDummyButton count={dummyCars.length} />
          <Link
          href="/cars/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
        >
          <Plus className="w-4 h-4" />
          Add Car
        </Link>
        </div>
      </div>

      {dummyCars.length > 0 && (
        <div
          className="mb-5 rounded-2xl border px-4 py-3.5 sm:px-5"
          style={{ background: "#fffbeb", borderColor: "#fde68a" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#92400e" }}>
            {dummyCars.length} dummy listing{dummyCars.length === 1 ? "" : "s"} hidden from the public site
          </p>
          <p className="text-xs mt-1" style={{ color: "#b45309" }}>
            These are placeholder cars for testing. Add real cars with your own photos, then delete all dummy listings in one click.
          </p>
        </div>
      )}

      {/* Table card */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        {allCars.length === 0 ? (
          <div className="py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "var(--brand-bg)" }}
            >
              <Car className="w-8 h-8" style={{ color: "var(--brand)" }} />
            </div>
            <p className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>No cars yet</p>
            <p className="text-sm mt-2 mb-6" style={{ color: "var(--text-secondary)" }}>
              Add your first car to the inventory to get started
            </p>
            <Link
              href="/cars/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
            >
              <Plus className="w-4 h-4" />
              Add First Car
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Vehicle</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Specs</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Price</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Reg</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {allCars.map((car, idx) => (
                  <tr
                    key={car.id}
                    className="transition-colors hover:bg-slate-50"
                    style={{
                      borderBottom: idx < allCars.length - 1 ? "1px solid var(--border-light)" : "none",
                      opacity: car.isSold ? 0.65 : 1,
                      background: car.isDummy ? "#fffbeb" : undefined,
                    }}
                  >
                    {/* Vehicle */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border"
                          style={{ background: "var(--background)", borderColor: "var(--border)" }}
                        >
                          {car.images?.[0] ? (
                            <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                              {car.year} {car.make} {car.model}
                            </p>
                            {car.isDummy && (
                              <span
                                className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                                style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}
                              >
                                Dummy
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {car.colour} · {car.bodyType}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Specs */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm" style={{ color: "var(--text-primary)" }}>{car.engineSize || "—"}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {car.fuelType} · {car.transmission}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {car.mileage?.toLocaleString()} mi
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold" style={{ color: "var(--brand)" }}>
                        £{Number(car.price).toLocaleString()}
                      </p>
                      <p className="text-xs line-through mt-0.5" style={{ color: "var(--text-muted)" }}>
                        £{Number(car.marketValue).toLocaleString()}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={
                          car.category === "Cat S"
                            ? { background: "#fef2f2", color: "#dc2626" }
                            : car.category === "Cat N"
                            ? { background: "#fff7ed", color: "#f97316" }
                            : { background: "#f0fdf4", color: "#16a34a" }
                        }
                      >
                        {car.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusDropdown id={car.id} status={car.status ?? "available"} />
                    </td>

                    {/* Registration */}
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs font-mono font-semibold px-2 py-1 rounded"
                        style={{ background: "var(--background)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                      >
                        {car.registration || "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/cars/${car.id}`}
                          className="p-2 rounded-lg border transition-all hover:bg-slate-50"
                          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        {!car.isDummy && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_MAIN_SITE_URL}/cars/${car.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border transition-all hover:bg-slate-50"
                            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                            title="View on site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <DeleteCarButton id={car.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
