"use client"

import {
  DataTable,
  type Column,
  type SortState,
} from "@/components/shared/data-table"
import { PromotionActions } from "@/features/promotions/components/promotion-actions"
import {
  CountdownBadge,
  CouponCode,
  DiscountBadge,
  PromotionStatusBadge,
  ScopeBadge,
  TypeBadge,
} from "@/features/promotions/components/promotion-badges"
import { UsageProgress } from "@/features/promotions/components/usage-progress"
import { formatCompactCurrency } from "@/lib/constants"
import type { Promotion } from "@/types"

interface PromotionsTableProps {
  data: Promotion[]
  loading?: boolean
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  sort: SortState | null
  onSortChange: (id: string) => void
  onView: (promotion: Promotion) => void
  onDelete: (promotion: Promotion) => void
  onToggleStatus: (promotion: Promotion) => void
  empty?: React.ReactNode
}

export function PromotionsTable({
  data,
  loading,
  selectedIds,
  onSelectionChange,
  sort,
  onSortChange,
  onView,
  onDelete,
  onToggleStatus,
  empty,
}: PromotionsTableProps) {
  const columns: Column<Promotion>[] = [
    {
      id: "name",
      header: "Promotion",
      sortable: true,
      cell: (p) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{p.name}</p>
            {p.featured ? (
              <span className="size-1.5 shrink-0 rounded-full bg-gold" aria-label="Featured" />
            ) : null}
          </div>
          <div className="mt-1 lg:hidden">
            <CouponCode code={p.code} />
          </div>
          <p className="hidden text-xs text-muted-foreground lg:block">
            <ScopeBadge scope={p.scope} label={p.scopeLabel} />
          </p>
        </div>
      ),
    },
    {
      id: "code",
      header: "Code",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (p) => <CouponCode code={p.code} />,
    },
    {
      id: "type",
      header: "Type",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
      cell: (p) => <TypeBadge type={p.type} />,
    },
    {
      id: "discount",
      header: "Discount",
      cell: (p) => <DiscountBadge promotion={p} />,
    },
    {
      id: "usedCount",
      header: "Usage",
      sortable: true,
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      width: "12rem",
      cell: (p) => <UsageProgress used={p.usedCount} cap={p.maxUses} />,
    },
    {
      id: "revenue",
      header: "Revenue",
      align: "right",
      sortable: true,
      headerClassName: "hidden 2xl:table-cell",
      cellClassName: "hidden 2xl:table-cell",
      cell: (p) =>
        p.revenue > 0 ? (
          <span className="font-medium tabular">{formatCompactCurrency(p.revenue)}</span>
        ) : (
          <span className="text-sm text-muted-foreground/50">—</span>
        ),
    },
    {
      id: "status",
      header: "Status",
      cell: (p) => (
        <div className="flex flex-col items-start gap-1">
          <PromotionStatusBadge status={p.status} />
          <CountdownBadge startDate={p.startDate} endDate={p.endDate} status={p.status} />
        </div>
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
      skeletonRows={8}
      empty={empty}
      rowActions={(p) => (
        <PromotionActions
          promotion={p}
          onView={onView}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      )}
    />
  )
}
