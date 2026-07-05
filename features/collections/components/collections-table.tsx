"use client"

import { CalendarClock } from "lucide-react"

import { CampaignCover } from "@/components/shared/campaign-cover"
import {
  DataTable,
  type Column,
  type SortState,
} from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { CollectionActions } from "@/features/collections/components/collection-actions"
import {
  COLLECTION_STATUS_META,
  VISIBILITY_META,
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/lib/constants"
import type { Collection } from "@/types"

interface CollectionsTableProps {
  data: Collection[]
  loading?: boolean
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  sort: SortState | null
  onSortChange: (id: string) => void
  onView: (collection: Collection) => void
  onDelete: (collection: Collection) => void
  empty?: React.ReactNode
}

export function CollectionsTable({
  data,
  loading,
  selectedIds,
  onSelectionChange,
  sort,
  onSortChange,
  onView,
  onDelete,
  empty,
}: CollectionsTableProps) {
  const columns: Column<Collection>[] = [
    {
      id: "name",
      header: "Collection",
      sortable: true,
      cell: (c) => (
        <div className="flex items-center gap-3">
          <CampaignCover
            seed={c.cover}
            className="size-11 shrink-0 rounded-lg"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-medium">{c.name}</p>
              {c.featured ? <StatusBadge label="Featured" tone="gold" /> : null}
            </div>
            <p className="truncate text-xs text-muted-foreground">{c.subtitle}</p>
          </div>
        </div>
      ),
    },
    {
      id: "season",
      header: "Season",
      cell: (c) => (
        <span className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground">
          {c.season}
        </span>
      ),
    },
    {
      id: "categories",
      header: "Categories",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
      cell: (c) => (
        <span className="text-sm text-muted-foreground tabular">
          {c.categories.length}
        </span>
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
      id: "revenue",
      header: "Revenue",
      align: "right",
      sortable: true,
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (c) =>
        c.revenue > 0 ? (
          <span className="font-medium tabular">{formatCurrency(c.revenue)}</span>
        ) : (
          <span className="text-sm text-muted-foreground/60">—</span>
        ),
    },
    {
      id: "visibility",
      header: "Visibility",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
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
        <div className="flex flex-col gap-0.5">
          <StatusBadge
            label={COLLECTION_STATUS_META[c.status].label}
            tone={COLLECTION_STATUS_META[c.status].tone}
          />
          {c.status === "scheduled" && c.scheduledFor ? (
            <span className="flex items-center gap-1 text-[0.7rem] text-muted-foreground tabular">
              <CalendarClock className="size-3" />
              {formatDate(c.scheduledFor)}
            </span>
          ) : null}
        </div>
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
        <CollectionActions collection={c} onView={onView} onDelete={onDelete} />
      )}
    />
  )
}
