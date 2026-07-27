import Link from "next/link"
import { getStorefrontVisitorStats } from "@/lib/visitor-stats"
import {
  AnalyticsPeriodDays,
  NamedCount,
  getStorefrontAnalyticsDetails,
} from "@/lib/analytics-details"
import { ArrowLeft, Globe, MapPin, Megaphone, MousePointerClick, Users } from "lucide-react"

function parsePeriod(value: string | undefined): AnalyticsPeriodDays {
  if (value === "7") return 7
  if (value === "90") return 90
  return 30
}

function BreakdownCard({
  title,
  subtitle,
  items,
  emptyMessage,
}: {
  title: string
  subtitle: string
  items: NamedCount[]
  emptyMessage: string
}) {
  return (
    <div
      className="rounded-2xl border overflow-hidden h-full"
      style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="px-5 py-4 border-b" style={{ background: "#fafafa", borderColor: "var(--border)" }}>
        <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          {title}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      </div>
      <div className="p-5 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {emptyMessage}
          </p>
        ) : (
          items.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold truncate" style={{ color: "var(--text-secondary)" }}>
                  {item.name}
                </span>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: "var(--text-primary)" }}>
                  {item.count}{" "}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                    ({item.pct}%)
                  </span>
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.max(item.pct, 4)}%`,
                    background: "linear-gradient(90deg, #0891b2, #0d9488)",
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const { days: daysParam } = await searchParams
  const periodDays = parsePeriod(daysParam)
  const [summary, details] = await Promise.all([
    getStorefrontVisitorStats(),
    getStorefrontAnalyticsDetails(periodDays),
  ])

  const periodLinks: { days: AnalyticsPeriodDays; label: string }[] = [
    { days: 7, label: "7 days" },
    { days: 30, label: "30 days" },
    { days: 90, label: "90 days" },
  ]

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 lg:mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold w-fit"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Storefront analytics
            </h1>
            <p className="text-sm mt-0.5 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              Where visitors are based (approximate area from IP on Vercel), how they arrived—Direct,
              Facebook, Google Ads, referrals—and which pages they viewed. Use{" "}
              <code className="text-xs px-1 py-0.5 rounded bg-slate-100">utm_source</code> on ad links
              for clearer campaign labels.
            </p>
          </div>
          <div className="flex rounded-xl border p-1 gap-1 self-start" style={{ borderColor: "var(--border)" }}>
            {periodLinks.map(({ days, label }) => {
              const active = periodDays === days
              return (
                <Link
                  key={days}
                  href={`/analytics?days=${days}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={
                    active
                      ? { background: "var(--brand-bg)", color: "var(--brand)" }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {details === null ? (
        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{ background: "#fffbeb", borderColor: "#fcd34d", color: "#92400e" }}
        >
          Detailed analytics need the{" "}
          <code className="text-xs bg-white/80 px-1 py-0.5 rounded">storefront_page_views</code> table. Run{" "}
          <code className="text-xs bg-white/80 px-1 py-0.5 rounded">pnpm migrate:analytics</code> from the
          storefront app, then redeploy the storefront so new visits are logged.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
            {[
              {
                label: `Unique visitors (${periodDays}d)`,
                value: details.uniqueVisitors.toLocaleString(),
                sub: `${details.pageViews.toLocaleString()} page views`,
                icon: Users,
                color: "#0d9488",
              },
              {
                label: "Visitors today",
                value: (summary?.today ?? 0).toLocaleString(),
                sub: "All-time unique days",
                icon: MousePointerClick,
                color: "#0891b2",
              },
              {
                label: "Top lead source",
                value: details.leadSources[0]?.name ?? "—",
                sub: details.leadSources[0]
                  ? `${details.leadSources[0].count} first-time sessions`
                  : "No data yet",
                icon: Megaphone,
                color: "#ea580c",
              },
              {
                label: "Top area",
                value: details.topAreas[0]?.name ?? "—",
                sub: details.topAreas[0]
                  ? `${details.topAreas[0].count} visitors`
                  : "Geo appears on live Vercel traffic",
                icon: MapPin,
                color: "#4f46e5",
              },
            ].map((stat) => (
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
                    <p className="text-lg lg:text-xl font-bold mt-2 truncate" style={{ color: "var(--text-primary)" }}>
                      {stat.value}
                    </p>
                    <p className="text-xs mt-1 truncate" style={{ color: "var(--text-muted)" }}>
                      {stat.sub}
                    </p>
                  </div>
                  <stat.icon className="w-5 h-5 flex-shrink-0" style={{ color: stat.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <BreakdownCard
              title="Where leads come from"
              subtitle="First visit in period (best for Facebook vs direct enquiry)"
              items={details.leadSources}
              emptyMessage="No visits recorded in this period yet."
            />
            <BreakdownCard
              title="Traffic sources"
              subtitle="Unique visitors by how sessions are classified"
              items={details.trafficSources}
              emptyMessage="No traffic source data yet."
            />
            <BreakdownCard
              title="Visitor areas"
              subtitle="Nearest city / region / country (not exact address)"
              items={details.topAreas}
              emptyMessage="Location data fills in on production Vercel visits."
            />
            <BreakdownCard
              title="Referring sites"
              subtitle="Hostname when not direct"
              items={details.topReferrers.filter((r) => r.name !== "Direct / none")}
              emptyMessage="No external referrers yet—many ad clicks show as Direct or Facebook."
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="xl:col-span-1">
              <BreakdownCard
                title="Top pages"
                subtitle="Most viewed paths"
                items={details.topPages}
                emptyMessage="No page views yet."
              />
            </div>
            <div
              className="xl:col-span-2 rounded-2xl border overflow-hidden"
              style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="px-5 py-4 border-b flex items-center gap-2" style={{ background: "#fafafa", borderColor: "var(--border)" }}>
                <Globe className="w-4 h-4" style={{ color: "var(--brand)" }} />
                <div>
                  <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    Recent visits
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Latest page views with area and source
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wide" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                      <th className="px-4 py-3 font-semibold">When</th>
                      <th className="px-4 py-3 font-semibold">Area</th>
                      <th className="px-4 py-3 font-semibold">Source</th>
                      <th className="px-4 py-3 font-semibold">Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.recentVisits.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center" style={{ color: "var(--text-muted)" }}>
                          No visits in this period.
                        </td>
                      </tr>
                    ) : (
                      details.recentVisits.map((visit) => (
                        <tr key={visit.id} className="border-b" style={{ borderColor: "var(--border)" }}>
                          <td className="px-4 py-3 whitespace-nowrap align-top">
                            <span className="block text-xs" style={{ color: "var(--text-primary)" }}>
                              {visit.createdAt.toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {visit.isFirstVisit && (
                              <span
                                className="text-[10px] font-bold uppercase tracking-wide mt-1 inline-block px-1.5 py-0.5 rounded"
                                style={{ background: "#fff7ed", color: "#c2410c" }}
                              >
                                First visit
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 align-top max-w-[140px]">
                            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                              {visit.area}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top max-w-[160px]">
                            <span className="text-xs font-medium block" style={{ color: "var(--text-primary)" }}>
                              {visit.trafficSource}
                            </span>
                            {visit.referrerHost && (
                              <span className="text-[11px] block truncate" style={{ color: "var(--text-muted)" }}>
                                {visit.referrerHost}
                              </span>
                            )}
                            {visit.utmCampaign && (
                              <span className="text-[11px] block truncate" style={{ color: "var(--text-muted)" }}>
                                Campaign: {visit.utmCampaign}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <code className="text-xs" style={{ color: "var(--text-secondary)" }}>
                              {visit.path}
                            </code>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
