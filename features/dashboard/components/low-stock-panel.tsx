"use client"

import { ArrowUpRight, PackageCheck } from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { DataTable, type Column } from "@/components/shared/data-table"
import { EmptyState } from "@/components/shared/empty-state"
import { ProductThumb } from "@/components/shared/product-thumb"
import { Button } from "@/components/ui/button"
import { lowStockProducts } from "@/lib/mock-data/dashboard"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

const columns: Column<Product>[] = [
  {
    id: "product",
    header: "Product",
    cell: (p) => (
      <div className="flex items-center gap-2.5">
        <ProductThumb seed={p.image} name={p.name} className="size-9" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{p.name}</p>
          <p className="text-xs text-muted-foreground tabular">{p.sku}</p>
        </div>
      </div>
    ),
  },
  {
    id: "stock",
    header: "Stock",
    align: "right",
    cell: (p) => {
      const out = p.stock === 0
      return (
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              "text-sm font-medium tabular",
              out ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"
            )}
          >
            {out ? "Out of stock" : `${p.stock} left`}
          </span>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", out ? "bg-rose-500" : "bg-amber-500")}
              style={{ width: `${Math.max(6, (p.stock / p.lowStockThreshold) * 100)}%` }}
            />
          </div>
        </div>
      )
    },
  },
]

export function LowStockPanel() {
  return (
    <ChartCard
      title="Low Stock Alerts"
      description="Items at or below their restock threshold"
      action={
        <Button variant="ghost" size="sm">
          Manage <ArrowUpRight className="size-3.5" />
        </Button>
      }
      contentClassName="p-0"
    >
      <DataTable
        columns={columns}
        data={lowStockProducts}
        getRowId={(p) => p.id}
        empty={
          <EmptyState
            icon={PackageCheck}
            title="Everything's stocked"
            description="No products are below their threshold."
            compact
          />
        }
      />
    </ChartCard>
  )
}
