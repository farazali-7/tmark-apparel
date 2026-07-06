import { AlertTriangle, PackageX } from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { ProductThumb } from "@/components/shared/product-thumb"
import { BreakdownList } from "@/features/analytics/components/breakdown-list"
import { ProductPerformanceTable } from "@/features/analytics/components/product-performance-table"
import {
  bestSellers,
  lowStockAlerts,
  noSalesProducts,
  revenueByCategory,
  topFabrics,
  topSizes,
} from "@/lib/mock-data/analytics"
import { formatCompactCurrency, formatNumber } from "@/lib/constants"

export function ProductsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Best Selling Products" description="Units and revenue this period" className="lg:col-span-2">
          <ProductPerformanceTable data={bestSellers} />
        </ChartCard>
        <ChartCard title="Top Categories" description="By revenue">
          <BreakdownList items={revenueByCategory} format={formatCompactCurrency} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Top Fabrics" description="Most-sold materials by units">
          <BreakdownList items={topFabrics} format={formatNumber} />
        </ChartCard>
        <ChartCard title="Top Sizes" description="Where demand sits">
          <BreakdownList items={topSizes} format={formatNumber} accentTop={false} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Low Stock" description="Restock before they sell out" action={<AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />}>
          <ul className="divide-y">
            {lowStockAlerts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <ProductThumb seed={p.image} name={p.name} className="size-9" iconClassName="size-4" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 tabular dark:text-amber-400">
                  {p.stock} left
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
        <ChartCard title="No Sales" description="Idle products worth reviewing" action={<PackageX className="size-4 text-muted-foreground" />}>
          <ul className="divide-y">
            {noSalesProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <ProductThumb seed={p.image} name={p.name} className="size-9" iconClassName="size-4" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <span className="text-xs text-muted-foreground tabular">{p.days}d idle</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </div>
  )
}
