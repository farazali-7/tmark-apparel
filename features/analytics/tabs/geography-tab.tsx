import { ChartCard } from "@/components/shared/chart-card"
import { BreakdownList } from "@/features/analytics/components/breakdown-list"
import { DonutChart } from "@/features/analytics/components/donut-chart"
import {
  domesticVsInternational,
  revenueByCountry,
  topCities,
} from "@/lib/mock-data/analytics"
import { formatCompactCurrency } from "@/lib/constants"

export function GeographyTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue by Country" description="Your global footprint" className="lg:col-span-2">
          <BreakdownList items={revenueByCountry} format={formatCompactCurrency} accentTop={false} showRank />
        </ChartCard>
        <ChartCard title="Domestic vs International" description="Revenue split">
          <DonutChart data={domesticVsInternational} centerValue="34%" centerLabel="international" format={(v) => `${v}%`} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Top Cities" description="Highest-earning metros">
          <BreakdownList items={topCities} format={formatCompactCurrency} accentTop={false} showRank />
        </ChartCard>
        <ChartCard title="Shipping Destinations" description="Where orders are delivered">
          <BreakdownList items={revenueByCountry} format={formatCompactCurrency} accentTop={false} />
        </ChartCard>
      </div>
    </div>
  )
}
