import { EyeOff, FolderTree, LayoutGrid, Package, Star } from "lucide-react"

import {
  SummaryCard,
  SummaryCardSkeleton,
} from "@/components/shared/summary-card"
import { formatNumber } from "@/lib/constants"
import type { Category } from "@/types"

interface CategoriesSummaryProps {
  categories: Category[]
  loading?: boolean
}

export function CategoriesSummary({
  categories,
  loading = false,
}: CategoriesSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const total = categories.length
  const active = categories.filter((c) => c.status === "active").length
  const hidden = categories.filter((c) => c.visibility === "hidden").length
  const assigned = categories.reduce((sum, c) => sum + c.productCount, 0)
  const featured = categories.filter((c) => c.featured).length

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <SummaryCard
        icon={FolderTree}
        label="Total Categories"
        value={formatNumber(total)}
        description="Across the catalog"
        trend={{ value: 4.2, direction: "up" }}
      />
      <SummaryCard
        icon={LayoutGrid}
        label="Active"
        value={formatNumber(active)}
        description="Live on the storefront"
        trend={{ value: 2.1, direction: "up" }}
      />
      <SummaryCard
        icon={EyeOff}
        label="Hidden"
        value={formatNumber(hidden)}
        description="Not shown to customers"
      />
      <SummaryCard
        icon={Package}
        label="Products Assigned"
        value={formatNumber(assigned)}
        description="Across all categories"
        trend={{ value: 6.4, direction: "up" }}
      />
      <SummaryCard
        icon={Star}
        label="Featured"
        value={formatNumber(featured)}
        description="Pinned to storefront"
        accent
      />
    </div>
  )
}
