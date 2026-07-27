import {
  boolean,
  integer,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  date,
  uuid,
} from "drizzle-orm/pg-core"

// Better Auth tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Cars table
export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  publicId: uuid("public_id").notNull().unique().defaultRandom(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  marketValue: numeric("market_value", { precision: 10, scale: 2 }).notNull(),
  mileage: integer("mileage").notNull(),
  fuelType: text("fuel_type").notNull(),
  transmission: text("transmission").notNull(),
  colour: text("colour").notNull(),
  bodyType: text("body_type").notNull(),
  doors: integer("doors").notNull(),
  engineSize: text("engine_size"),
  category: text("category").notNull().default("Cat S"),
  description: text("description"),
  features: text("features").array(),
  images: text("images").array(),
  motExpiry: date("mot_expiry"),
  registration: text("registration"),
  status: text("status").notNull().default("available"),
  isDummy: boolean("is_dummy").notNull().default(false),
  isSold: boolean("is_sold").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type Car = typeof cars.$inferSelect
export type NewCar = typeof cars.$inferInsert

/** Anonymous storefront visitors (first-party cookie). */
export const storefrontVisitors = pgTable("storefront_visitors", {
  id: uuid("id").primaryKey(),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
})

/** One row per visitor per calendar day (UTC) for unique daily counts. */
export const storefrontVisitorDays = pgTable(
  "storefront_visitor_days",
  {
    visitorId: uuid("visitor_id")
      .notNull()
      .references(() => storefrontVisitors.id, { onDelete: "cascade" }),
    visitDate: date("visit_date").notNull(),
  },
  (table) => [primaryKey({ columns: [table.visitorId, table.visitDate] })]
)

export const storefrontPageViews = pgTable("storefront_page_views", {
  id: serial("id").primaryKey(),
  visitorId: uuid("visitor_id")
    .notNull()
    .references(() => storefrontVisitors.id, { onDelete: "cascade" }),
  path: text("path").notNull(),
  referrer: text("referrer"),
  referrerHost: text("referrer_host"),
  trafficSource: text("traffic_source").notNull(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
