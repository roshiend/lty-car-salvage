import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "../lib/db/schema"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool, { schema })

// All images sourced from Wikimedia Commons (CC BY-SA)
const WC = "https://commons.wikimedia.org/wiki/Special:FilePath/"
const WU = "https://upload.wikimedia.org/wikipedia/commons/"

const cars = [
  {
    make: "Ford",
    model: "Focus Titanium",
    year: 2020,
    price: "5495.00",
    marketValue: "9200.00",
    mileage: 48200,
    fuelType: "Petrol",
    transmission: "Manual",
    colour: "Magnetic Grey",
    bodyType: "Hatchback",
    doors: 5,
    engineSize: "1.0L EcoBoost",
    category: "Cat S",
    registration: "LTY CARS",
    description:
      "A well-maintained Ford Focus Titanium with a full service history. Lightly repaired Cat S — structurally sound and MOT'd. Perfect everyday family hatchback at a fraction of its market value.",
    features: [
      "Apple CarPlay & Android Auto",
      "Heated Front Seats",
      "Rear Parking Sensors",
      "Climate Control",
      "Cruise Control",
      "LED Headlights",
      'Alloy Wheels 17"',
      "Full Service History",
    ],
    images: [
      WC + "2018_Ford_Focus_Titanium_EcoBoost_1.0_Front.jpg",
      WC + "2015_Ford_Focus_Titanium_Hatchback_1.0_Rear.jpg",
    ],
    motExpiry: "2026-03-14",
    isSold: false,
  },
  {
    make: "Vauxhall",
    model: "Astra SRi",
    year: 2019,
    price: "4295.00",
    marketValue: "7800.00",
    mileage: 62500,
    fuelType: "Diesel",
    transmission: "Manual",
    colour: "Summit White",
    bodyType: "Hatchback",
    doors: 5,
    engineSize: "1.6L CDTi",
    category: "Cat N",
    registration: "LTY CARS",
    description:
      "Vauxhall Astra SRi diesel — economical and spacious. Cat N (non-structural), cosmetically repaired and ready to drive. Great motorway cruiser with low running costs.",
    features: [
      "IntelliLink Infotainment",
      "Rear Camera",
      "Front & Rear Sensors",
      "Heated Steering Wheel",
      "DAB Radio",
      "Sport Seats",
      "Lane Departure Warning",
      "Speed Sign Recognition",
    ],
    images: [
      WU + "thumb/c/c5/2020_Vauxhall_Astra_SRi_VX_Line_Turbo_1.2_facelift_Front.jpg/960px-2020_Vauxhall_Astra_SRi_VX_Line_Turbo_1.2_facelift_Front.jpg",
      WC + "2018_Vauxhall_Astra_SRi_Turbo_1.4.jpg",
    ],
    motExpiry: "2025-11-20",
    isSold: false,
  },
  {
    make: "Volkswagen",
    model: "Golf Match Edition",
    year: 2020,
    price: "7995.00",
    marketValue: "13500.00",
    mileage: 39800,
    fuelType: "Petrol",
    transmission: "Manual",
    colour: "Deep Black Pearl",
    bodyType: "Hatchback",
    doors: 5,
    engineSize: "1.5L TSI",
    category: "Cat S",
    registration: "LTY CARS",
    description:
      "Premium VW Golf Match Edition — refined, reliable and composed. Category S with full structural repair carried out by approved bodyshop. Drives and feels like a brand new car.",
    features: [
      "Discover Pro Navigation",
      "Digital Cockpit",
      "Keyless Entry",
      "Adaptive Cruise Control",
      "Park Assist",
      "Wireless Phone Charging",
      "LED Headlights",
      '18" Pretoria Alloys',
    ],
    images: [
      WC + "2020_Volkswagen_Golf_Life_1.0_Front.jpg",
      WC + "2020_Volkswagen_Golf_Life_1.0_Rear.jpg",
    ],
    motExpiry: "2026-06-30",
    isSold: false,
  },
  {
    make: "Nissan",
    model: "Qashqai Acenta",
    year: 2019,
    price: "6495.00",
    marketValue: "10900.00",
    mileage: 55300,
    fuelType: "Petrol",
    transmission: "Manual",
    colour: "Pearl White",
    bodyType: "SUV",
    doors: 5,
    engineSize: "1.3L DIG-T",
    category: "Cat N",
    registration: "LTY CARS",
    description:
      "The UK's best-selling crossover at a bargain price. Nissan Qashqai Acenta in excellent condition — Cat N with only minor cosmetic damage repaired. High driving position, spacious boot and great fuel economy.",
    features: [
      "NissanConnect Navigation",
      "Around View Monitor",
      "Intelligent Emergency Braking",
      "Lane Departure Warning",
      "Traffic Sign Recognition",
      "Roof Rails",
      "Tinted Rear Windows",
      "Heated Front Seats",
    ],
    images: [
      WU + "thumb/d/dc/2019_Nissan_Qashqai_Acenta_Premium_Front.jpg/960px-2019_Nissan_Qashqai_Acenta_Premium_Front.jpg",
      WC + "2019_Nissan_Qashqai_Acenta_Premium_Rear.jpg",
    ],
    motExpiry: "2026-01-08",
    isSold: false,
  },
  {
    make: "Toyota",
    model: "Corolla Icon Tech",
    year: 2021,
    price: "8995.00",
    marketValue: "15200.00",
    mileage: 29400,
    fuelType: "Hybrid",
    transmission: "Automatic",
    colour: "Bi-Tone Silver",
    bodyType: "Hatchback",
    doors: 5,
    engineSize: "1.8L Hybrid",
    category: "Cat S",
    registration: "LTY CARS",
    description:
      "Low-mileage Toyota Corolla hybrid — ultra-reliable and incredibly economical. Cat S repair professionally completed. Toyota's legendary reliability means this is one of the safest buys on the market.",
    features: [
      "Toyota Touch 2 with Go Navigation",
      "JBL Premium Sound",
      "Pre-Collision System",
      "Adaptive Cruise Control",
      "Wireless Apple CarPlay",
      "Rear Cross-Traffic Alert",
      '18" Alloy Wheels',
      "Bi-LED Headlights",
    ],
    images: [
      WC + "2019_Toyota_Corolla_Icon_Tech_VVT-I_1.2.jpg",
      WC + "Toyota_Corolla_Hatchback_Hybrid_(front).jpg",
    ],
    motExpiry: "2026-09-15",
    isSold: false,
  },
  {
    make: "Skoda",
    model: "Octavia SE L",
    year: 2020,
    price: "7495.00",
    marketValue: "12600.00",
    mileage: 44700,
    fuelType: "Diesel",
    transmission: "Manual",
    colour: "Brilliant Silver",
    bodyType: "Estate",
    doors: 5,
    engineSize: "2.0L TDI",
    category: "Cat N",
    registration: "LTY CARS",
    description:
      "Massive boot space, refined diesel engine and packed with kit — the Skoda Octavia SE L estate is perfect for families. Cat N, non-structural damage repaired. Outstanding value.",
    features: [
      "Columbus Navigation",
      "Virtual Cockpit",
      "Canton Sound System",
      "Electric Boot",
      "Heated Front & Rear Seats",
      "Panoramic Sunroof",
      "Adaptive Headlights",
      "Front Assist with Pedestrian Detection",
    ],
    images: [
      WU + "6/69/Skoda_Octavia_IV_Combi_IMG_2617.jpg",
      WU + "7/7a/Skoda_Octavia_IV_Combi_IMG_3099.jpg",
    ],
    motExpiry: "2026-04-22",
    isSold: false,
  },
  {
    make: "Honda",
    model: "Civic SR",
    year: 2019,
    price: "5995.00",
    marketValue: "9800.00",
    mileage: 51900,
    fuelType: "Petrol",
    transmission: "Manual",
    colour: "Lunar Silver Metallic",
    bodyType: "Hatchback",
    doors: 5,
    engineSize: "1.0L VTEC Turbo",
    category: "Cat S",
    registration: "LTY CARS",
    description:
      "Sporty Honda Civic SR with turbocharged engine — punchy and fun to drive. Full Cat S structural repair completed by specialist. Honda's famous build quality shines through.",
    features: [
      "Honda Sensing Safety Suite",
      '7" Touchscreen with Apple CarPlay',
      "Rear Camera",
      "Blind Spot Information",
      "Honda CONNECT Services",
      "Sport Seats",
      "LED Rear Lights",
      '17" Alloy Wheels',
    ],
    images: [
      WU + "thumb/6/6e/Honda_CIVIC_HATCHBACK_%28DBA-FK7%29_front.jpg/960px-Honda_CIVIC_HATCHBACK_%28DBA-FK7%29_front.jpg",
      WU + "thumb/9/9f/2018_Honda_Civic_Hatchback_1.5_Turbo_%28rear%29%2C_West_Surabaya.jpg/960px-2018_Honda_Civic_Hatchback_1.5_Turbo_%28rear%29%2C_West_Surabaya.jpg",
    ],
    motExpiry: "2025-12-05",
    isSold: false,
  },
  {
    make: "Kia",
    model: "Sportage 3",
    year: 2018,
    price: "5295.00",
    marketValue: "8900.00",
    mileage: 68100,
    fuelType: "Diesel",
    transmission: "Manual",
    colour: "Aurora Black",
    bodyType: "SUV",
    doors: 5,
    engineSize: "1.7L CRDi",
    category: "Cat N",
    registration: "LTY CARS",
    description:
      "Bold and practical Kia Sportage diesel SUV. Cat N with minor cosmetic repairs — mechanically perfect. Comes with remaining Kia 7-year warranty where applicable. Great family SUV at a steal.",
    features: [
      "TomTom Navigation",
      "Rear Camera with Parking Sensors",
      "Heated Steering Wheel",
      "Heated Front Seats",
      "Electric Sunroof",
      "Roof Rails",
      "Leather Seats",
      '18" Alloy Wheels',
    ],
    images: [
      WC + "2018_Kia_Sportage_GT-Line_S_CRDi_Automatic_2.0_Front.jpg",
      WC + "Kia_Sportage_Facelift,_Paris_Motor_Show_2018,_IMG_0287.jpg",
    ],
    motExpiry: "2025-10-18",
    isSold: false,
  },
  {
    make: "Hyundai",
    model: "Tucson Premium SE",
    year: 2020,
    price: "7295.00",
    marketValue: "12100.00",
    mileage: 37600,
    fuelType: "Petrol",
    transmission: "Automatic",
    colour: "Aqua Blue",
    bodyType: "SUV",
    doors: 5,
    engineSize: "1.6L T-GDi",
    category: "Cat S",
    registration: "LTY CARS",
    description:
      "Premium Hyundai Tucson with automatic gearbox — effortless and composed. Cat S professionally repaired with full body shop documentation. Striking Aqua Blue colour stands out from the crowd.",
    features: [
      '8" Sat-Nav Touchscreen',
      "Wireless Charging",
      "Heated & Ventilated Front Seats",
      "360° Surround View Camera",
      "Lane Keeping Assist",
      "Blind Spot Detection",
      "Smart Electric Tailgate",
      '19" Premium Alloys',
    ],
    images: [
      WC + "2018_Hyundai_Tucson_(TL)_Active_X_wagon_(2018-08-20)_01.jpg",
      WC + "Hyundai_Tucson_TL_in_Punta_del_Este_01.JPG",
    ],
    motExpiry: "2026-07-02",
    isSold: false,
  },
  {
    make: "Seat",
    model: "Leon FR",
    year: 2021,
    price: "6995.00",
    marketValue: "11800.00",
    mileage: 26300,
    fuelType: "Petrol",
    transmission: "Manual",
    colour: "Desire Red",
    bodyType: "Hatchback",
    doors: 5,
    engineSize: "1.5L TSI EVO",
    category: "Cat N",
    registration: "LTY CARS",
    description:
      "Low-mileage SEAT Leon FR in stunning Desire Red. Cat N with only superficial damage repaired — underneath it's immaculate. The FR trim adds sporty body kit, Beats Audio and performance-tuned suspension.",
    features: [
      "Beats Premium Audio",
      '10.25" Digital Cockpit',
      "Wireless Apple CarPlay & Android Auto",
      "FR Sport Suspension",
      "Bucket Style Sport Seats",
      "Full LED Matrix Headlights",
      "Keyless Entry & Start",
      '18" FR Alloy Wheels',
    ],
    images: [
      WU + "thumb/2/24/2020_SEAT_Leon_FR_TSi_Evo_1.5_Front.jpg/960px-2020_SEAT_Leon_FR_TSi_Evo_1.5_Front.jpg",
      WC + "Seat_Leon_FR_(IV)_%E2%80%93_f_01012023.jpg",
    ],
    motExpiry: "2026-08-11",
    isSold: false,
  },
]

async function seed() {
  console.log("🌱 Seeding database with 10 UK cars...")

  await db.delete(schema.cars)
  console.log("🗑  Cleared existing cars")

  for (const car of cars) {
    await db.insert(schema.cars).values({ ...car, isDummy: true })
    console.log(`✅ Added: ${car.year} ${car.make} ${car.model}`)
  }

  console.log("\n🎉 Seeding complete! 10 cars added to the database.")
  await pool.end()
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err)
  process.exit(1)
})
