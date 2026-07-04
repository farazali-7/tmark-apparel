"use client"

import { ProductThumb } from "@/components/shared/product-thumb"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  DataTable,
  type Column,
  type SortState,
} from "@/components/shared/data-table"
import { ProductActions } from "@/features/products/components/product-actions"
import { PRODUCT_STATUS_META, formatCurrency, formatDate } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

interface ProductsTableProps {
  data: Product[]
  loading?: boolean
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  sort: SortState | null
  onSortChange: (id: string) => void
  onView: (product: Product) => void
  onDelete: (product: Product) => void
  empty?: React.ReactNode
}

function StockCell({ product }: { product: Product }) {
  const out = product.stock === 0
  const low = !out && product.stock <= product.lowStockThreshold
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "size-1.5 rounded-full",
          out ? "bg-rose-500" : low ? "bg-amber-500" : "bg-emerald-500"
        )}
      />
      <span className="tabular">{product.stock}</span>
      {low ? (
        <span className="text-xs text-amber-600 dark:text-amber-400">Low</span>
      ) : null}
    </div>
  )
}

export function ProductsTable({
  data,
  loading,
  selectedIds,
  onSelectionChange,
  sort,
  onSortChange,
  onView,
  onDelete,
  empty,
}: ProductsTableProps) {
  const columns: Column<Product>[] = [
    {
      id: "name",
      header: "Product",
      sortable: true,
      cell: (p) => (
        <div className="flex items-center gap-3">
          <ProductThumb seed={p.image} name={p.name} className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{p.name}</p>
            <p className="truncate text-xs text-muted-foreground">{p.fabric}</p>
          </div>
        </div>
      ),
    },
    {
      id: "sku",
      header: "SKU",
      cell: (p) => (
        <span className="text-xs text-muted-foreground tabular">{p.sku}</span>
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: (p) => <span className="text-sm">{p.category}</span>,
    },
    {
      id: "collection",
      header: "Collection",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (p) => (
        <span className="text-sm text-muted-foreground">{p.collection}</span>
      ),
    },
    {
      id: "price",
      header: "Price",
      align: "right",
      sortable: true,
      cell: (p) =>
        p.salePrice ? (
          <div className="flex flex-col items-end">
            <span className="font-medium tabular">
              {formatCurrency(p.salePrice)}
            </span>
            <span className="text-xs text-muted-foreground line-through tabular">
              {formatCurrency(p.price)}
            </span>
          </div>
        ) : (
          <span className="font-medium tabular">{formatCurrency(p.price)}</span>
        ),
    },
    {
      id: "stock",
      header: "Stock",
      sortable: true,
      cell: (p) => <StockCell product={p} />,
    },
    {
      id: "status",
      header: "Status",
      cell: (p) => (
        <StatusBadge
          label={PRODUCT_STATUS_META[p.status].label}
          tone={PRODUCT_STATUS_META[p.status].tone}
        />
      ),
    },
    {
      id: "createdAt",
      header: "Created",
      sortable: true,
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
      cell: (p) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(p.createdAt)}
        </span>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(p) => p.id}
      loading={loading}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      sort={sort}
      onSortChange={onSortChange}
      onRowClick={onView}
      stickyHeader
      empty={empty}
      rowActions={(p) => (
        <ProductActions product={p} onView={onView} onDelete={onDelete} />
      )}
    />
  )
}
