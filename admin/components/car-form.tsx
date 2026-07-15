"use client"

import { useState } from "react"
import { createCar, updateCar } from "@/app/actions/cars"
import type { Car } from "@/lib/db/schema"
import { Loader2, ArrowLeft, X, Plus, ChevronDown } from "lucide-react"
import Link from "next/link"
import { CAR_STATUSES } from "@/lib/car-status"
import ImageUploader from "@/components/image-uploader"

const makes = [
  "Audi","BMW","Ford","Honda","Hyundai","Jaguar","Kia","Land Rover",
  "Lexus","Mazda","Mercedes-Benz","Mini","Nissan","Peugeot","Porsche",
  "Renault","Seat","Skoda","Tesla","Toyota","Vauxhall","Volkswagen","Volvo",
]
const fuelTypes = ["Petrol","Diesel","Electric","Hybrid","Plug-in Hybrid"]
const transmissions = ["Manual","Automatic","Semi-Automatic"]
const bodyTypes = ["Hatchback","Saloon","Estate","SUV","Coupe","Convertible","MPV","Van"]
const categories = ["Cat S","Cat N","Repaired"]

interface CarFormProps {
  car?: Car
}

/* ─── Shared input styles ─── */
const inp: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "14px",
  lineHeight: "1.5",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  appearance: "none",
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  )
}

function Card({ title, children, noPad }: { title?: string; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div
      className="rounded-xl border bg-white"
      style={{ borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {title && (
        <div className="px-5 py-4 border-b" style={{ borderColor: "#f1f5f9" }}>
          <h3 className="font-semibold text-sm" style={{ color: "#0f172a" }}>{title}</h3>
        </div>
      )}
      <div className={noPad ? "" : "p-5"}>{children}</div>
    </div>
  )
}

export default function CarForm({ car }: CarFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(car?.status ?? "available")
  const [images, setImages] = useState<string[]>(car?.images || [])
  const [features, setFeatures] = useState<string[]>(car?.features || [])
  const [newFeature, setNewFeature] = useState("")

  const addFeature = () => {
    const val = newFeature.trim()
    if (val && !features.includes(val)) {
      setFeatures((p) => [...p, val])
      setNewFeature("")
    }
  }
  const removeFeature = (i: number) => setFeatures((p) => p.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    fd.set("images", JSON.stringify(images))
    fd.set("features", features.join("\n"))
    try {
      car ? await updateCar(car.id, fd) : await createCar(fd)
    } catch {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pb-16">

      {/* ── Sticky top header bar ── */}
      <div
        className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 mb-6"
        style={{
          background: "rgba(241,245,249,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: back + breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/cars"
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all hover:bg-white flex-shrink-0"
              style={{ borderColor: "#e2e8f0", color: "#64748b" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Inventory</span>
            </Link>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span className="text-sm font-semibold truncate" style={{ color: "#0f172a" }}>
              {car ? `${car.year} ${car.make} ${car.model}` : "Add new car"}
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/cars"
              className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all hover:bg-white"
              style={{ borderColor: "#e2e8f0", color: "#64748b" }}
            >
              Discard
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: loading ? "#94a3b8" : "#0f172a" }}
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Saving…" : car ? "Save" : "Save car"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

        {/* ════════ LEFT COLUMN ════════ */}
        <div className="space-y-5">

          {/* Vehicle title */}
          <Card title="Vehicle">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label required>Make</Label>
                <div className="relative">
                  <select name="make" defaultValue={car?.make || ""} required style={inp}>
                    <option value="">Select make</option>
                    {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                </div>
              </div>
              <div>
                <Label required>Model</Label>
                <input name="model" defaultValue={car?.model || ""} required placeholder="e.g. Golf GTI" style={inp} />
              </div>
              <div>
                <Label required>Year</Label>
                <input
                  name="year"
                  type="number"
                  defaultValue={car?.year || new Date().getFullYear()}
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  style={inp}
                />
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card title="Description">
            <textarea
              name="description"
              defaultValue={car?.description || ""}
              rows={5}
              placeholder="Describe the car's condition, repair history, service records, any known issues…"
              style={{ ...inp, resize: "vertical" }}
            />
          </Card>

          {/* Media */}
          <Card title="Media">
            <ImageUploader images={images} onChange={setImages} />
          </Card>

          {/* Pricing */}
          <Card title="Pricing">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label required>Sale price</Label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium select-none"
                    style={{ color: "#94a3b8" }}
                  >£</span>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={car?.price?.toString() || ""}
                    required
                    placeholder="8,999"
                    style={{ ...inp, paddingLeft: "26px" }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "#94a3b8" }}>Your asking price</p>
              </div>
              <div>
                <Label required>Market value</Label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium select-none"
                    style={{ color: "#94a3b8" }}
                  >£</span>
                  <input
                    name="marketValue"
                    type="number"
                    step="0.01"
                    defaultValue={car?.marketValue?.toString() || ""}
                    required
                    placeholder="13,500"
                    style={{ ...inp, paddingLeft: "26px" }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "#94a3b8" }}>Shown as crossed-out comparison price</p>
              </div>
            </div>
          </Card>

          {/* Specifications */}
          <Card title="Specifications">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <Label required>Mileage</Label>
                <input name="mileage" type="number" defaultValue={car?.mileage || ""} required placeholder="45,000" style={inp} />
              </div>
              <div>
                <Label required>Fuel type</Label>
                <div className="relative">
                  <select name="fuelType" defaultValue={car?.fuelType || ""} required style={inp}>
                    <option value="">Select</option>
                    {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                </div>
              </div>
              <div>
                <Label required>Transmission</Label>
                <div className="relative">
                  <select name="transmission" defaultValue={car?.transmission || ""} required style={inp}>
                    <option value="">Select</option>
                    {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                </div>
              </div>
              <div>
                <Label required>Body type</Label>
                <div className="relative">
                  <select name="bodyType" defaultValue={car?.bodyType || ""} required style={inp}>
                    <option value="">Select</option>
                    {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                </div>
              </div>
              <div>
                <Label required>Colour</Label>
                <input name="colour" defaultValue={car?.colour || ""} required placeholder="e.g. Pearl White" style={inp} />
              </div>
              <div>
                <Label required>Doors</Label>
                <div className="relative">
                  <select name="doors" defaultValue={car?.doors?.toString() || "5"} required style={inp}>
                    {[2,3,4,5].map((d) => <option key={d} value={d}>{d} doors</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                </div>
              </div>
              <div>
                <Label>Engine size</Label>
                <input name="engineSize" defaultValue={car?.engineSize || ""} placeholder="e.g. 2.0L TDI" style={inp} />
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card title="Features &amp; extras">
            <div className="flex flex-wrap gap-2 mb-3">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border"
                  style={{ background: "#f8fafc", borderColor: "#e2e8f0", color: "#374151" }}
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-red-100"
                    style={{ color: "#94a3b8" }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {features.length === 0 && (
                <p className="text-sm" style={{ color: "#94a3b8" }}>No features added yet</p>
              )}
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: "#f1f5f9" }}>
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g. Heated Seats, Apple CarPlay, Parking Sensors…"
                style={{ ...inp, flex: 1 }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border flex-shrink-0 transition-all hover:bg-slate-50"
                style={{ borderColor: "#e2e8f0", color: "#374151" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </Card>

        </div>

        {/* ════════ RIGHT SIDEBAR ════════ */}
        <div className="space-y-5 lg:sticky lg:top-[57px] lg:self-start">

          {/* Status */}
          <Card title="Status">
            <input type="hidden" name="status" value={selectedStatus} />
            <div className="space-y-2">
              {CAR_STATUSES.map((s) => {
                const active = selectedStatus === s.value
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSelectedStatus(s.value)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border text-sm font-medium transition-all text-left"
                    style={{
                      borderColor: active ? s.border : "#e2e8f0",
                      background: active ? s.bg : "#fafafa",
                      color: active ? s.color : "#374151",
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: s.dot }}
                    />
                    <span className="flex-1">{s.label}</span>
                    {active && (
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                        style={{ background: s.dot }}
                      >✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Organisation */}
          <Card title="Organisation">
            <div className="space-y-4">
              <div>
                <Label required>Damage category</Label>
                <div className="relative">
                  <select name="category" defaultValue={car?.category || "Cat S"} required style={inp}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "#94a3b8" }}>
                  Cat S = structural · Cat N = non-structural · Repaired = fully fixed
                </p>
              </div>
            </div>
          </Card>

          {/* Registration & MOT */}
          <Card title="Registration &amp; MOT">
            <div className="space-y-4">
              <div>
                <Label>Registration plate</Label>
                <input
                  name="registration"
                  defaultValue={car?.registration || "LTY CARS"}
                  placeholder="AB12 CDE"
                  style={{
                    ...inp,
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "0.08em",
                    fontWeight: "700",
                    textTransform: "uppercase",
                  }}
                />
              </div>
              <div>
                <Label>MOT expiry</Label>
                <input
                  name="motExpiry"
                  type="date"
                  defaultValue={
                    car?.motExpiry
                      ? new Date(car.motExpiry).toISOString().split("T")[0]
                      : ""
                  }
                  style={inp}
                />
              </div>
            </div>
          </Card>

          {/* Mobile-only save */}
          <div className="lg:hidden flex gap-2">
            <Link
              href="/cars"
              className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-white"
              style={{ borderColor: "#e2e8f0", color: "#64748b" }}
            >
              Discard
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#0f172a" }}
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Saving…" : car ? "Save" : "Save car"}
            </button>
          </div>

        </div>
      </div>
    </form>
  )
}
