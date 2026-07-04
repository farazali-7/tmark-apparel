import { ChartCard } from "@/components/shared/chart-card"
import { categorySales } from "@/lib/mock-data/dashboard"
import { formatNumber } from "@/lib/constants"

export function TopCategories() {
  const max = Math.max(...categorySales.map((c) => c.value))

  return (
    <ChartCard
      title="Best Selling Categories"
      description="Units sold this month"
    >
      <div className="space-y-4">
        {categorySales.map((cat, i) => (
          <div key={cat.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-4 text-xs text-muted-foreground tabular">
                  {i + 1}
                </span>
                <span className="font-medium">{cat.label}</span>
              </span>
              <span className="text-muted-foreground tabular">
                {formatNumber(cat.value)}
              </span>
            </div>
            <div className="ml-6 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground/80 transition-all"
                style={{ width: `${(cat.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
