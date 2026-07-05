"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Ban,
  Download,
  Plus,
  Printer,
  RefreshCw,
  SearchX,
  Truck,
  Upload,
} from "lucide-react"

import { BulkActionBar } from "@/components/shared/bulk-action-bar"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { SortState } from "@/components/shared/data-table"
import { CreateOrderSheet } from "@/features/orders/components/create-order-sheet"
import { OrderDrawer } from "@/features/orders/components/order-drawer"
import { OrderPipeline } from "@/features/orders/components/order-pipeline"
import { OrdersGrid } from "@/features/orders/components/orders-grid"
import { OrdersSummary } from "@/features/orders/components/orders-summary"
import { OrdersTable } from "@/features/orders/components/orders-table"
import {
  OrdersToolbar,
  type OrderFilters,
  type OrdersViewMode,
} from "@/features/orders/components/orders-toolbar"
import { ORDER_PIPELINE } from "@/lib/constants"
import { orderDetails as seedOrders } from "@/lib/mock-data/orders-detail"
import type { OrderDetail, OrderStage } from "@/types"

const DEFAULT_FILTERS: OrderFilters = {
  type: "all",
  payment: "all",
  scope: "all",
  country: "all",
}

const PRIORITY_RANK: Record<string, number> = {
  standard: 0,
  high: 1,
  urgent: 2,
}

export function OrdersView() {
  const [items, setItems] = React.useState<OrderDetail[]>(seedOrders)
  const [loading, setLoading] = React.useState(true)

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<OrderFilters>(DEFAULT_FILTERS)
  const [stageFilter, setStageFilter] = React.useState<OrderStage | null>(null)
  const [sort, setSort] = React.useState<SortState>({ id: "createdAt", dir: "desc" })
  const [view, setView] = React.useState<OrdersViewMode>("list")

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(8)

  const [detailOrder, setDetailOrder] = React.useState<OrderDetail | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [cancelTarget, setCancelTarget] = React.useState<OrderDetail | null>(null)
  const [bulkCancelOpen, setBulkCancelOpen] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "c" || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (
        el &&
        (el.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))
      )
        return
      e.preventDefault()
      setCreateOpen(true)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const stageCounts = React.useMemo(() => {
    const counts = Object.fromEntries(
      ORDER_PIPELINE.map((s) => [s, 0])
    ) as Record<OrderStage, number>
    for (const o of items) {
      if (o.stage in counts) counts[o.stage] += 1
    }
    return counts
  }, [items])

  const countries = React.useMemo(
    () => Array.from(new Set(items.map((o) => o.customer.country))).sort(),
    [items]
  )

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (query) count++
    if (stageFilter) count++
    ;(Object.keys(filters) as (keyof OrderFilters)[]).forEach((k) => {
      if (filters[k] !== "all") count++
    })
    return count
  }, [query, filters, stageFilter])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = items.filter((o) => {
      if (q) {
        const haystack = [
          o.reference,
          o.customer.name,
          o.customer.phone,
          o.customer.email,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (stageFilter && o.stage !== stageFilter) return false
      if (filters.type !== "all" && o.type !== filters.type) return false
      if (filters.payment !== "all" && o.payment.status !== filters.payment)
        return false
      if (filters.scope !== "all" && o.shipment.scope !== filters.scope)
        return false
      if (filters.country !== "all" && o.customer.country !== filters.country)
        return false
      return true
    })

    const dir = sort.dir === "asc" ? 1 : -1
    result.sort((a, b) => {
      switch (sort.id) {
        case "total":
          return (a.total - b.total) * dir
        case "priority":
          return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * dir
        case "deadline": {
          const at = a.deliveryDeadline
            ? new Date(a.deliveryDeadline).getTime()
            : Number.POSITIVE_INFINITY
          const bt = b.deliveryDeadline
            ? new Date(b.deliveryDeadline).getTime()
            : Number.POSITIVE_INFINITY
          return (at - bt) * dir
        }
        default:
          return (
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
            dir
          )
      }
    })
    return result
  }, [items, query, filters, stageFilter, sort])

  const paged = React.useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  )

  function handleSortColumn(id: string) {
    setSort((prev) =>
      prev.id === id
        ? { id, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { id, dir: id === "createdAt" ? "desc" : "asc" }
    )
  }

  function openDetails(order: OrderDetail) {
    setDetailOrder(order)
    setDetailOpen(true)
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function cancelOrders(ids: string[]) {
    setItems((prev) =>
      prev.map((o) =>
        ids.includes(o.id) ? { ...o, stage: "cancelled" as OrderStage } : o
      )
    )
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(
      ids.length > 1 ? `${ids.length} orders cancelled` : "Order cancelled",
      { description: "The customer has been notified." }
    )
  }

  function handleRefresh() {
    setLoading(true)
    setSelectedIds([])
    setTimeout(() => {
      setLoading(false)
      toast.success("Orders refreshed")
    }, 500)
  }

  function clearFilters() {
    setQuery("")
    setFilters(DEFAULT_FILTERS)
    setStageFilter(null)
    setPage(1)
  }
  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(1)
  }
  function handleFilterChange(key: keyof OrderFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }
  function handleStageSelect(stage: OrderStage | null) {
    setStageFilter(stage)
    setPage(1)
  }
  function handleViewChange(next: OrdersViewMode) {
    setView(next)
    setPage(1)
  }
  function handlePageSizeChange(size: number) {
    setPageSize(size)
    setPage(1)
  }

  const isFiltered = activeFilterCount > 0
  const emptyState = (
    <EmptyState
      icon={isFiltered ? SearchX : Truck}
      title={isFiltered ? "No matching orders" : "No orders yet."}
      description={
        isFiltered
          ? "Try adjusting your search, filters or the selected pipeline stage."
          : "When customers place orders they'll appear here, ready to track and fulfil."
      }
      action={
        isFiltered ? (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Create Manual Order
          </Button>
        )
      }
    />
  )

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        eyebrow="Commerce / Orders"
        title="Orders"
        description="Manage customer purchases, production progress and deliveries."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              aria-label="Refresh orders"
            >
              <RefreshCw className="size-4" /> Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast("Import coming soon")}
            >
              <Upload className="size-4" /> Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Orders exported to CSV")}
            >
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" /> Create Order
            </Button>
          </>
        }
      />

      <OrdersSummary orders={items} loading={loading} />

      {loading ? (
        <Skeleton className="h-[9.5rem] w-full rounded-xl" />
      ) : (
        <OrderPipeline
          counts={stageCounts}
          active={stageFilter}
          onSelect={handleStageSelect}
        />
      )}

      <section className="space-y-4">
        <SectionHeader
          title="All Orders"
          description="Every order — ready-to-wear, made-to-measure and bespoke"
        />
        <div className="space-y-4 rounded-xl border bg-card p-3 sm:p-4">
          <OrdersToolbar
            query={query}
            onQueryChange={handleQueryChange}
            filters={filters}
            onFilterChange={handleFilterChange}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={handleViewChange}
            onClear={clearFilters}
            activeCount={activeFilterCount}
            countries={countries}
          />

          <Separator />

          {view === "grid" ? (
            loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-56 rounded-xl" />
                ))}
              </div>
            ) : paged.length === 0 ? (
              emptyState
            ) : (
              <OrdersGrid
                data={paged}
                selectedIds={selectedIds}
                onSelectToggle={toggleOne}
                onView={openDetails}
                onCancel={setCancelTarget}
              />
            )
          ) : (
            <OrdersTable
              data={paged}
              loading={loading}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              sort={sort}
              onSortChange={handleSortColumn}
              onView={openDetails}
              onCancel={setCancelTarget}
              empty={emptyState}
            />
          )}

          {!loading && filtered.length > 0 ? (
            <>
              <Separator />
              <PaginationBar
                page={page}
                pageSize={pageSize}
                total={filtered.length}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[8, 16, 24]}
              />
            </>
          ) : null}
        </div>
      </section>

      <BulkActionBar count={selectedIds.length} onClear={() => setSelectedIds([])}>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => toast.success(`${selectedIds.length} invoices queued to print`)}
        >
          <Printer className="size-4" /> Print
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => toast.success(`${selectedIds.length} orders marked as shipped`)}
        >
          <Truck className="size-4" /> Ship
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-destructive hover:text-destructive"
          onClick={() => setBulkCancelOpen(true)}
        >
          <Ban className="size-4" /> Cancel
        </Button>
      </BulkActionBar>

      <OrderDrawer
        order={detailOrder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onCancel={(o) => {
          setDetailOpen(false)
          setCancelTarget(o)
        }}
      />

      <CreateOrderSheet open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        title="Cancel this order?"
        description={
          cancelTarget ? (
            <>
              <span className="font-medium text-foreground">
                {cancelTarget.reference}
              </span>{" "}
              for {cancelTarget.customer.name} will be cancelled and the customer
              notified. Any payment will need to be refunded separately.
            </>
          ) : null
        }
        confirmLabel="Cancel order"
        destructive
        onConfirm={() => {
          if (cancelTarget) cancelOrders([cancelTarget.id])
          setCancelTarget(null)
        }}
      />

      <ConfirmDialog
        open={bulkCancelOpen}
        onOpenChange={setBulkCancelOpen}
        title={`Cancel ${selectedIds.length} orders?`}
        description="The selected orders will be cancelled and customers notified. Payments must be refunded separately. This cannot be undone."
        confirmLabel="Cancel all"
        destructive
        onConfirm={() => cancelOrders(selectedIds)}
      />
    </PageContainer>
  )
}
