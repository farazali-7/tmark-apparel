"use client"

import {
  DataTable,
  type Column,
  type SortState,
} from "@/components/shared/data-table"
import { EntityAvatar } from "@/components/shared/entity-avatar"
import { CustomerActions } from "@/features/customers/components/customer-actions"
import {
  CustomerStatusBadge,
  MeasurementsBadge,
  VIPBadge,
} from "@/features/customers/components/customer-badges"
import { formatCompactCurrency, formatNumber, formatRelative } from "@/lib/constants"
import type { CustomerDetail } from "@/types"

interface CustomersTableProps {
  data: CustomerDetail[]
  loading?: boolean
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  sort: SortState | null
  onSortChange: (id: string) => void
  onView: (customer: CustomerDetail) => void
  onArchive: (customer: CustomerDetail) => void
  empty?: React.ReactNode
}

export function CustomersTable({
  data,
  loading,
  selectedIds,
  onSelectionChange,
  sort,
  onSortChange,
  onView,
  onArchive,
  empty,
}: CustomersTableProps) {
  const columns: Column<CustomerDetail>[] = [
    {
      id: "name",
      header: "Customer",
      sortable: true,
      cell: (c) => (
        <div className="flex items-center gap-2.5">
          <EntityAvatar initials={c.initials} seed={c.id} className="size-9" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium">{c.name}</span>
              {c.vip ? <VIPBadge tier={c.tier} /> : null}
            </div>
            <span className="truncate text-xs text-muted-foreground">{c.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: "country",
      header: "Country",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (c) => (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{c.flag}</span>
          {c.country}
        </span>
      ),
    },
    {
      id: "ordersCount",
      header: "Orders",
      align: "right",
      sortable: true,
      headerClassName: "hidden sm:table-cell",
      cellClassName: "hidden sm:table-cell",
      cell: (c) => <span className="font-medium tabular">{formatNumber(c.ordersCount)}</span>,
    },
    {
      id: "lifetimeValue",
      header: "Lifetime Spend",
      align: "right",
      sortable: true,
      cell: (c) => (
        <span className="font-medium tabular">
          {formatCompactCurrency(c.lifetimeValue)}
        </span>
      ),
    },
    {
      id: "lastOrderAt",
      header: "Last Order",
      sortable: true,
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
      cell: (c) => (
        <span className="text-sm text-muted-foreground">
          {c.lastOrderAt ? formatRelative(c.lastOrderAt) : "—"}
        </span>
      ),
    },
    {
      id: "measurements",
      header: "Measurements",
      headerClassName: "hidden 2xl:table-cell",
      cellClassName: "hidden 2xl:table-cell",
      cell: (c) =>
        c.hasMeasurements ? (
          <MeasurementsBadge />
        ) : (
          <span className="text-sm text-muted-foreground/50">—</span>
        ),
    },
    {
      id: "status",
      header: "Status",
      cell: (c) => <CustomerStatusBadge status={c.status} />,
    },
    {
      id: "joinedAt",
      header: "Joined",
      sortable: true,
      headerClassName: "hidden 2xl:table-cell",
      cellClassName: "hidden 2xl:table-cell",
      cell: (c) => (
        <span className="text-sm text-muted-foreground">
          {formatRelative(c.joinedAt)}
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
      skeletonRows={8}
      empty={empty}
      rowActions={(c) => (
        <CustomerActions customer={c} onView={onView} onArchive={onArchive} />
      )}
    />
  )
}
