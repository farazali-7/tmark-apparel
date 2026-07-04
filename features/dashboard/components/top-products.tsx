import { ChartCard } from "@/components/shared/chart-card"
import { ProductThumb } from "@/components/shared/product-thumb"
import { topProducts } from "@/lib/mock-data/dashboard"
import { formatCurrency, formatNumber } from "@/lib/constants"

export function TopProducts() {
  return (
    <ChartCard title="Top Selling Products" description="By units sold this month">
      <ul className="divide-y">
        {topProducts.map((product, i) => (
          <li
            key={product.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="w-4 text-center text-xs font-medium text-muted-foreground tabular">
              {i + 1}
            </span>
            <ProductThumb
              seed={product.image}
              name={product.name}
              className="size-10"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium tabular">
                {formatNumber(product.unitsSold)}
              </p>
              <p className="text-xs text-muted-foreground tabular">
                {formatCurrency(product.revenue)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
