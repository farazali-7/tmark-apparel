import { ProductThumb } from "@/components/shared/product-thumb"
import { Sparkline } from "@/components/shared/sparkline"
import { TrendIndicator } from "@/components/shared/trend-indicator"
import { formatCompactCurrency, formatNumber } from "@/lib/constants"
import type { ProductPerformance } from "@/lib/mock-data/analytics"

export function ProductPerformanceTable({ data }: { data: ProductPerformance[] }) {
  return (
    <ul className="divide-y">
      {data.map((p, i) => (
        <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span className="w-4 shrink-0 text-center text-xs text-muted-foreground tabular">{i + 1}</span>
          <ProductThumb seed={p.image} name={p.name} className="size-10" iconClassName="size-4" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{p.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {p.category} · {formatNumber(p.units)} sold
            </p>
          </div>
          <Sparkline
            data={p.spark}
            positive={p.trend === "up"}
            className="hidden h-8 w-16 opacity-70 sm:block"
          />
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-medium tabular">{formatCompactCurrency(p.revenue)}</span>
            <TrendIndicator value={p.change} trend={p.trend} />
          </div>
        </li>
      ))}
    </ul>
  )
}
