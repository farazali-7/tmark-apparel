import { ChartCard } from "@/components/shared/chart-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { BreakdownList } from "@/features/analytics/components/breakdown-list"
import { DonutChart } from "@/features/analytics/components/donut-chart"
import { RevenueTrendChart } from "@/features/analytics/components/revenue-trend-chart"
import { StatTiles } from "@/features/analytics/components/stat-tiles"
import {
  orderStatusDistribution,
  orderStats,
  revenueByCategory,
  revenueByCollection,
  revenueByCountry,
  revenueByMonth,
  revenueByOrderType,
} from "@/lib/mock-data/analytics"
import { formatCompactCurrency, formatNumber } from "@/lib/constants"

export function RevenueTab({ compare }: { compare: boolean }) {
  const totalOrders = orderStatusDistribution.reduce((s, d) => s + d.value, 0)
  return (
    <div className="space-y-6">
      <ChartCard
        title="Revenue by Month"
        description="Net revenue across the year, current vs. previous"
        action={<StatusBadge label="+18.2%" tone="success" />}
      >
        <RevenueTrendChart data={revenueByMonth} compare={compare} height={320} />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue by Category">
          <BreakdownList items={revenueByCategory} format={formatCompactCurrency} />
        </ChartCard>
        <ChartCard title="Revenue by Collection">
          <BreakdownList items={revenueByCollection} format={formatCompactCurrency} />
        </ChartCard>
        <ChartCard title="Revenue by Country">
          <BreakdownList items={revenueByCountry} format={formatCompactCurrency} accentTop={false} />
        </ChartCard>
        <ChartCard title="Revenue by Order Type">
          <DonutChart
            data={revenueByOrderType}
            centerValue="24.8M"
            centerLabel="PKR total"
            format={formatCompactCurrency}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Order Status Distribution" className="lg:col-span-2">
          <DonutChart
            data={orderStatusDistribution}
            centerValue={formatNumber(totalOrders)}
            centerLabel="total orders"
            format={formatNumber}
          />
        </ChartCard>
        <div className="lg:col-span-1">
          <StatTiles tiles={orderStats} className="grid-cols-2 lg:grid-cols-2" />
        </div>
      </div>
    </div>
  )
}
