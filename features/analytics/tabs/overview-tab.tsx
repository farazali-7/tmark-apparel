import { ChartCard } from "@/components/shared/chart-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { BreakdownList } from "@/features/analytics/components/breakdown-list"
import { DonutChart } from "@/features/analytics/components/donut-chart"
import { InsightsPanel } from "@/features/analytics/components/insights-panel"
import { ProductPerformanceTable } from "@/features/analytics/components/product-performance-table"
import { ReportsPanel } from "@/features/analytics/components/reports-panel"
import { RevenueTrendChart } from "@/features/analytics/components/revenue-trend-chart"
import { TopCustomersList } from "@/features/analytics/components/top-customers-list"
import {
  bestSellers,
  revenueByCategory,
  revenueByCollection,
  revenueByMonth,
  revenueByOrderType,
  topCustomers,
} from "@/lib/mock-data/analytics"
import { formatCompactCurrency } from "@/lib/constants"

export function OverviewTab({ compare }: { compare: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Revenue over time"
          description="Monthly net revenue, current vs. previous year"
          className="lg:col-span-2"
          action={<StatusBadge label="+18.2%" tone="success" />}
        >
          <RevenueTrendChart data={revenueByMonth} compare={compare} />
        </ChartCard>
        <InsightsPanel />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue by Category" description="Where sales concentrate">
          <BreakdownList items={revenueByCategory} format={formatCompactCurrency} />
        </ChartCard>
        <ChartCard title="Revenue by Collection" description="Top merchandising campaigns">
          <BreakdownList items={revenueByCollection} format={formatCompactCurrency} />
        </ChartCard>
        <ChartCard title="Revenue by Order Type" description="RTW vs bespoke mix">
          <DonutChart
            data={revenueByOrderType}
            centerValue="24.8M"
            centerLabel="PKR total"
            format={formatCompactCurrency}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Best Selling Products" description="By revenue this period" className="lg:col-span-2">
          <ProductPerformanceTable data={bestSellers} />
        </ChartCard>
        <ChartCard title="Top Customers" description="Highest lifetime spend">
          <TopCustomersList data={topCustomers} />
        </ChartCard>
      </div>

      <ReportsPanel />
    </div>
  )
}
