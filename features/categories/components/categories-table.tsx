"use client"

import { CornerDownRight } from "lucide-react"

import {
  DataTable,
  type Column,
  type SortState,
} from "@/components/shared/data-table"
import { ProductThumb } from "@/components/shared/product-thumb"
import { StatusBadge } from "@/components/shared/status-badge"
import { CategoryActions } from "@/features/categories/components/category-actions"
import {
  CATEGORY_STATUS_META,
  VISIBILITY_META,
  formatDate,
  formatNumber,
} from "@/lib/constants"
import type { Category } from "@/types"

interface CategoriesTableProps {
  data: Category[]
  loading?: boolean
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  sort: SortState | null
  onSortChange: (id: string) => void
  onView: (category: Category) => void
  onDelete: (category: Category) => void
  empty?: React.ReactNode
}

export function CategoriesTable({
  data,
  loading,
  selectedIds,
  onSelectionChange,
  sort,
  onSortChange,
  onView,
  onDelete,
  empty,
}: CategoriesTableProps) {
  const columns: Column<Category>[] = [
    {
      id: "name",
      header: "Category",
      sortable: true,
      cell: (c) => (
        <div className="flex items-center gap-3">
          <ProductThumb seed={c.image} name={c.name} className="size-10" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {c.parent ? (
                <CornerDownRight className="size-3 text-muted-foreground/60" />
              ) : null}
              <p className="truncate text-sm font-medium">{c.name}</p>
              {c.featured ? (
                <StatusBadge label="Featured" tone="gold" />
              ) : null}
            </div>
            <p className="truncate text-xs text-muted-foreground tabular">
              /{c.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "description",
      header: "Description",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
      cell: (c) => (
        <p className="max-w-[22rem] truncate text-sm text-muted-foreground">
          {c.description}
        </p>
      ),
    },
    {
      id: "parent",
      header: "Parent",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (c) =>
        c.parent ? (
          <span className="text-sm">{c.parent}</span>
        ) : (
          <span className="text-sm text-muted-foreground/60">—</span>
        ),
    },
    {
      id: "productCount",
      header: "Products",
      align: "right",
      sortable: true,
      cell: (c) => (
        <span className="font-medium tabular">{formatNumber(c.productCount)}</span>
      ),
    },
    {
      id: "collections",
      header: "Collections",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (c) => (
        <div className="flex flex-wrap gap-1">
          {c.collections.slice(0, 2).map((col) => (
            <span
              key={col}
              className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {col.replace(" Collection", "")}
            </span>
          ))}
          {c.collections.length > 2 ? (
            <span className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground">
              +{c.collections.length - 2}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "visibility",
      header: "Visibility",
      cell: (c) => (
        <StatusBadge
          label={VISIBILITY_META[c.visibility].label}
          tone={VISIBILITY_META[c.visibility].tone}
        />
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (c) => (
        <StatusBadge
          label={CATEGORY_STATUS_META[c.status].label}
          tone={CATEGORY_STATUS_META[c.status].tone}
        />
      ),
    },
    {
      id: "updatedAt",
      header: "Updated",
      sortable: true,
      headerClassName: "hidden 2xl:table-cell",
      cellClassName: "hidden 2xl:table-cell",
      cell: (c) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(c.updatedAt)}
        </span>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(c) => c.id}
      loading={loading}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      sort={sort}
      onSortChange={onSortChange}
      onRowClick={onView}
      stickyHeader
      empty={empty}
      rowActions={(c) => (
        <CategoryActions category={c} onView={onView} onDelete={onDelete} />
      )}
    />
  )
}
