import { ChartCard } from "@/components/shared/chart-card"
import { BreakdownList } from "@/features/analytics/components/breakdown-list"
import { CustomerGrowthChart } from "@/features/analytics/components/customer-growth-chart"
import { DonutChart } from "@/features/analytics/components/donut-chart"
import { StatTiles } from "@/features/analytics/components/stat-tiles"
import { TopCustomersList } from "@/features/analytics/components/top-customers-list"
import {
  customerStats,
  newVsReturning,
  revenueByCountry,
  topCustomers,
} from "@/lib/mock-data/analytics"
import { formatCompactCurrency } from "@/lib/constants"

export function CustomersTab() {
  return (
    <div className="space-y-6">
      <StatTiles tiles={customerStats} />

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Customer Growth" description="Total base vs. returning buyers" className="lg:col-span-2">
          <CustomerGrowthChart />
        </ChartCard>
        <ChartCard title="New vs Returning" description="Share of revenue">
          <DonutChart data={newVsReturning} centerValue="61%" centerLabel="returning" format={(v) => `${v}%`} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Top Spending Customers" description="Highest lifetime value">
          <TopCustomersList data={topCustomers} />
        </ChartCard>
        <ChartCard title="Revenue by Market" description="Where your customers are">
          <BreakdownList items={revenueByCountry} format={formatCompactCurrency} accentTop={false} />
        </ChartCard>
      </div>
    </div>
  )
}
