"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Archive,
  Download,
  Mail,
  MessageCircle,
  RefreshCw,
  Send,
  Upload,
  UserPlus,
  Users,
  UserSearch,
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
import { CreateCustomerSheet } from "@/features/customers/components/create-customer-sheet"
import { CustomerDrawer } from "@/features/customers/components/customer-drawer"
import { CustomersGrid } from "@/features/customers/components/customers-grid"
import { CustomersSummary } from "@/features/customers/components/customers-summary"
import { CustomersTable } from "@/features/customers/components/customers-table"
import {
  CustomersToolbar,
  type CustomerFilters,
  type CustomersViewMode,
} from "@/features/customers/components/customers-toolbar"
import { SegmentCards } from "@/features/customers/components/segment-cards"
import { CUSTOMER_SEGMENTS, type SegmentId } from "@/features/customers/segments"
import { customerDetails as seedCustomers } from "@/lib/mock-data/customers-detail"
import type { CustomerDetail, CustomerStatus } from "@/types"

const DEFAULT_FILTERS: CustomerFilters = {
  vip: "all",
  country: "all",
  status: "all",
  relationship: "all",
}

export function CustomersView() {
  const [items, setItems] = React.useState<CustomerDetail[]>(seedCustomers)
  const [loading, setLoading] = React.useState(true)

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<CustomerFilters>(DEFAULT_FILTERS)
  const [segment, setSegment] = React.useState<SegmentId | null>(null)
  const [sort, setSort] = React.useState<SortState>({
    id: "lifetimeValue",
    dir: "desc",
  })
  const [view, setView] = React.useState<CustomersViewMode>("list")

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(8)

  const [detailCustomer, setDetailCustomer] = React.useState<CustomerDetail | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [archiveTarget, setArchiveTarget] = React.useState<CustomerDetail | null>(null)
  const [bulkArchiveOpen, setBulkArchiveOpen] = React.useState(false)

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

  const countries = React.useMemo(
    () => Array.from(new Set(items.map((c) => c.country))).sort(),
    [items]
  )

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (query) count++
    if (segment) count++
    ;(Object.keys(filters) as (keyof CustomerFilters)[]).forEach((k) => {
      if (filters[k] !== "all") count++
    })
    return count
  }, [query, filters, segment])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const segmentDef = segment
      ? CUSTOMER_SEGMENTS.find((s) => s.id === segment)
      : null

    const result = items.filter((c) => {
      if (q) {
        const haystack = [c.name, c.email, c.phone, c.reference]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (segmentDef && !segmentDef.match(c)) return false
      if (filters.vip === "vip" && !c.vip) return false
      if (filters.vip === "standard" && c.vip) return false
      if (filters.status !== "all" && c.status !== filters.status) return false
      if (filters.country !== "all" && c.country !== filters.country) return false
      switch (filters.relationship) {
        case "tailoring":
          if (!c.tailoringClient) return false
          break
        case "wedding":
          if (!c.weddingClient) return false
          break
        case "measurements":
          if (!c.hasMeasurements) return false
          break
        case "international":
          if (!c.international) return false
          break
      }
      return true
    })

    const dir = sort.dir === "asc" ? 1 : -1
    result.sort((a, b) => {
      switch (sort.id) {
        case "name":
          return a.name.localeCompare(b.name) * dir
        case "ordersCount":
          return (a.ordersCount - b.ordersCount) * dir
        case "joinedAt":
          return (
            (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()) * dir
          )
        case "lastOrderAt": {
          const at = a.lastOrderAt ? new Date(a.lastOrderAt).getTime() : 0
          const bt = b.lastOrderAt ? new Date(b.lastOrderAt).getTime() : 0
          return (at - bt) * dir
        }
        default:
          return (a.lifetimeValue - b.lifetimeValue) * dir
      }
    })
    return result
  }, [items, query, filters, segment, sort])

  const paged = React.useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  )

  function handleSortColumn(id: string) {
    setSort((prev) =>
      prev.id === id
        ? { id, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { id, dir: id === "name" ? "asc" : "desc" }
    )
  }

  function openDetails(customer: CustomerDetail) {
    setDetailCustomer(customer)
    setDetailOpen(true)
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function archiveCustomers(ids: string[]) {
    setItems((prev) =>
      prev.map((c) =>
        ids.includes(c.id)
          ? { ...c, status: "archived" as CustomerStatus }
          : c
      )
    )
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(
      ids.length > 1 ? `${ids.length} customers archived` : "Customer archived"
    )
  }

  function handleRefresh() {
    setLoading(true)
    setSelectedIds([])
    setTimeout(() => {
      setLoading(false)
      toast.success("Customers refreshed")
    }, 500)
  }

  function clearFilters() {
    setQuery("")
    setFilters(DEFAULT_FILTERS)
    setSegment(null)
    setPage(1)
  }
  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(1)
  }
  function handleFilterChange(key: keyof CustomerFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }
  function handleSegmentSelect(id: SegmentId | null) {
    setSegment(id)
    setPage(1)
  }
  function handleViewChange(next: CustomersViewMode) {
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
      icon={isFiltered ? UserSearch : Users}
      title={isFiltered ? "No matching customers" : "No customers yet."}
      description={
        isFiltered
          ? "Try adjusting your search, filters or the selected segment."
          : "Your client book is empty — add your first customer to start building relationships."
      }
      action={
        isFiltered ? (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <UserPlus className="size-4" /> Create Customer
          </Button>
        )
      }
    />
  )

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        eyebrow="Commerce / Customers"
        title="Customers"
        description="Manage customer relationships, purchase history and tailoring profiles."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              aria-label="Refresh customers"
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
              onClick={() => toast.success("Customers exported to CSV")}
            >
              <Download className="size-4" /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Invite link copied")}
            >
              <Send className="size-4" /> Invite
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <UserPlus className="size-4" /> Create Customer
            </Button>
          </>
        }
      />

      <CustomersSummary customers={items} loading={loading} />

      <SegmentCards
        customers={items}
        active={segment}
        onSelect={handleSegmentSelect}
        loading={loading}
      />

      <section className="space-y-4">
        <SectionHeader
          title="All Customers"
          description="Your complete client book — VIP, tailoring and retail"
        />
        <div className="space-y-4 rounded-xl border bg-card p-3 sm:p-4">
          <CustomersToolbar
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
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : paged.length === 0 ? (
              emptyState
            ) : (
              <CustomersGrid
                data={paged}
                selectedIds={selectedIds}
                onSelectToggle={toggleOne}
                onView={openDetails}
                onArchive={setArchiveTarget}
              />
            )
          ) : (
            <CustomersTable
              data={paged}
              loading={loading}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              sort={sort}
              onSortChange={handleSortColumn}
              onView={openDetails}
              onArchive={setArchiveTarget}
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
          onClick={() => toast.success(`Email drafted to ${selectedIds.length} customers`)}
        >
          <Mail className="size-4" /> Email
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => toast.success(`WhatsApp broadcast to ${selectedIds.length}`)}
        >
          <MessageCircle className="size-4" /> WhatsApp
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-destructive hover:text-destructive"
          onClick={() => setBulkArchiveOpen(true)}
        >
          <Archive className="size-4" /> Archive
        </Button>
      </BulkActionBar>

      <CustomerDrawer
        customer={detailCustomer}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onArchive={(c) => {
          setDetailOpen(false)
          setArchiveTarget(c)
        }}
      />

      <CreateCustomerSheet open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(o) => !o && setArchiveTarget(null)}
        title="Archive this customer?"
        description={
          archiveTarget ? (
            <>
              <span className="font-medium text-foreground">
                {archiveTarget.name}
              </span>{" "}
              will be moved to archived. Their orders, measurements and history are
              preserved and can be restored anytime.
            </>
          ) : null
        }
        confirmLabel="Archive"
        destructive
        onConfirm={() => {
          if (archiveTarget) archiveCustomers([archiveTarget.id])
          setArchiveTarget(null)
        }}
      />

      <ConfirmDialog
        open={bulkArchiveOpen}
        onOpenChange={setBulkArchiveOpen}
        title={`Archive ${selectedIds.length} customers?`}
        description="The selected customers will be moved to archived. Their data is preserved and can be restored anytime."
        confirmLabel="Archive all"
        destructive
        onConfirm={() => archiveCustomers(selectedIds)}
      />
    </PageContainer>
  )
}
