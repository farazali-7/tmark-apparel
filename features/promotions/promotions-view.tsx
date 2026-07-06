"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Download,
  Pause,
  Play,
  Plus,
  SearchX,
  Settings2,
  Tag,
  Trash2,
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
import { CreatePromotionSheet } from "@/features/promotions/components/create-promotion-sheet"
import { PromotionAnalytics } from "@/features/promotions/components/promotion-analytics"
import { PromotionDrawer } from "@/features/promotions/components/promotion-drawer"
import { PromotionTypes, type TypeTile } from "@/features/promotions/components/promotion-types"
import { PromotionsGrid } from "@/features/promotions/components/promotions-grid"
import { PromotionsSummary } from "@/features/promotions/components/promotions-summary"
import { PromotionsTable } from "@/features/promotions/components/promotions-table"
import {
  PromotionsToolbar,
  type PromotionFilters,
  type PromotionsViewMode,
} from "@/features/promotions/components/promotions-toolbar"
import { promotions as seedPromotions } from "@/lib/mock-data/promotions"
import type { Promotion, PromotionScope, PromotionStatus, PromotionType } from "@/types"

const DEFAULT_FILTERS: PromotionFilters = {
  status: "all",
  type: "all",
  scope: "all",
  usage: "all",
}

export function PromotionsView() {
  const [items, setItems] = React.useState<Promotion[]>(seedPromotions)
  const [loading, setLoading] = React.useState(true)

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<PromotionFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = React.useState<SortState>({ id: "createdAt", dir: "desc" })
  const [view, setView] = React.useState<PromotionsViewMode>("list")

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(8)

  const [detail, setDetail] = React.useState<Promotion | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [preset, setPreset] = React.useState<{
    type: PromotionType | null
    scope: PromotionScope | null
  }>({ type: null, scope: null })
  const [deleteTarget, setDeleteTarget] = React.useState<Promotion | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)

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
      openCreate(null, null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const activeTileKey = React.useMemo(() => {
    if (filters.type !== "all" && filters.scope === "all") return filters.type
    if (filters.scope !== "all" && filters.type === "all") return filters.scope
    return null
  }, [filters])

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (query) count++
    ;(Object.keys(filters) as (keyof PromotionFilters)[]).forEach((k) => {
      if (filters[k] !== "all") count++
    })
    return count
  }, [query, filters])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = items.filter((p) => {
      if (q && !`${p.name} ${p.code}`.toLowerCase().includes(q)) return false
      if (filters.status !== "all" && p.status !== filters.status) return false
      if (filters.type !== "all" && p.type !== filters.type) return false
      if (filters.scope !== "all" && p.scope !== filters.scope) return false
      switch (filters.usage) {
        case "high":
          if (p.usedCount < 100) return false
          break
        case "low":
          if (p.usedCount > 10) return false
          break
        case "never":
          if (p.usedCount !== 0) return false
          break
      }
      return true
    })

    const dir = sort.dir === "asc" ? 1 : -1
    result.sort((a, b) => {
      switch (sort.id) {
        case "name":
          return a.name.localeCompare(b.name) * dir
        case "usedCount":
          return (a.usedCount - b.usedCount) * dir
        case "revenue":
          return (a.revenue - b.revenue) * dir
        case "endDate": {
          const at = a.endDate ? new Date(a.endDate).getTime() : Number.POSITIVE_INFINITY
          const bt = b.endDate ? new Date(b.endDate).getTime() : Number.POSITIVE_INFINITY
          return (at - bt) * dir
        }
        default:
          return (
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
          )
      }
    })
    return result
  }, [items, query, filters, sort])

  const paged = React.useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  )

  function handleSortColumn(id: string) {
    setSort((prev) =>
      prev.id === id
        ? { id, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { id, dir: id === "name" || id === "endDate" ? "asc" : "desc" }
    )
  }

  function openDetails(promotion: Promotion) {
    setDetail(promotion)
    setDetailOpen(true)
  }

  function openCreate(type: PromotionType | null, scope: PromotionScope | null) {
    setPreset({ type, scope })
    setCreateOpen(true)
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleStatus(promotion: Promotion) {
    if (promotion.status === "expired") {
      toast("This promotion has expired")
      return
    }
    const next: PromotionStatus =
      promotion.status === "active" ? "paused" : "active"
    setItems((prev) =>
      prev.map((p) => (p.id === promotion.id ? { ...p, status: next } : p))
    )
    setDetail((d) => (d && d.id === promotion.id ? { ...d, status: next } : d))
    toast.success(
      next === "active" ? `${promotion.code} activated` : `${promotion.code} paused`
    )
  }

  function setStatusFor(ids: string[], status: PromotionStatus, verb: string) {
    setItems((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, status } : p))
    )
    setSelectedIds([])
    toast.success(`${ids.length} promotions ${verb}`)
  }

  function deletePromotions(ids: string[]) {
    setItems((prev) => prev.filter((p) => !ids.includes(p.id)))
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(
      ids.length > 1 ? `${ids.length} promotions deleted` : "Promotion deleted"
    )
  }

  function handleTileSelect(tile: TypeTile) {
    setPage(1)
    setFilters((prev) => {
      const isActive = tile.key === activeTileKey
      if (isActive) return { ...prev, type: "all", scope: "all" }
      if (tile.type) return { ...prev, type: tile.type, scope: "all" }
      if (tile.scope) return { ...prev, scope: tile.scope, type: "all" }
      return prev
    })
  }

  function clearFilters() {
    setQuery("")
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }
  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(1)
  }
  function handleFilterChange(key: keyof PromotionFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }
  function handleViewChange(next: PromotionsViewMode) {
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
      icon={isFiltered ? SearchX : Tag}
      title={isFiltered ? "No matching promotions" : "No promotions created yet."}
      description={
        isFiltered
          ? "Try adjusting your search or filters."
          : "Launch your first discount campaign to drive sales and reward loyal clients."
      }
      action={
        isFiltered ? (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={() => openCreate(null, null)}>
            <Plus className="size-4" /> Create Your First Promotion
          </Button>
        )
      }
    />
  )

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        eyebrow="Marketing / Promotions"
        title="Promotions"
        description="Create and manage discount campaigns, seasonal offers and customer incentives."
        actions={
          <>
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
              onClick={() => toast.success("Promotions exported to CSV")}
            >
              <Download className="size-4" /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast("Promotion settings")}
            >
              <Settings2 className="size-4" /> Settings
            </Button>
            <Button size="sm" onClick={() => openCreate(null, null)}>
              <Plus className="size-4" /> Create Promotion
            </Button>
          </>
        }
      />

      <PromotionsSummary promotions={items} loading={loading} />

      <PromotionTypes
        promotions={items}
        activeKey={activeTileKey}
        onSelect={handleTileSelect}
        onCreate={(tile) => openCreate(tile.type ?? null, tile.scope ?? null)}
        loading={loading}
      />

      <section className="space-y-4">
        <SectionHeader
          title="Campaign Performance"
          description="Where your promotions win — and which ones need attention"
        />
        <PromotionAnalytics promotions={items} onView={openDetails} loading={loading} />
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="All Promotions"
          description="Every campaign — active, scheduled, paused and expired"
        />
        <div className="space-y-4 rounded-xl border bg-card p-3 sm:p-4">
          <PromotionsToolbar
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
              <PromotionsGrid
                data={paged}
                selectedIds={selectedIds}
                onSelectToggle={toggleOne}
                onView={openDetails}
                onDelete={setDeleteTarget}
                onToggleStatus={toggleStatus}
              />
            )
          ) : (
            <PromotionsTable
              data={paged}
              loading={loading}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              sort={sort}
              onSortChange={handleSortColumn}
              onView={openDetails}
              onDelete={setDeleteTarget}
              onToggleStatus={toggleStatus}
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
          onClick={() => setStatusFor(selectedIds, "active", "activated")}
        >
          <Play className="size-4" /> Activate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => setStatusFor(selectedIds, "paused", "paused")}
        >
          <Pause className="size-4" /> Pause
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-destructive hover:text-destructive"
          onClick={() => setBulkDeleteOpen(true)}
        >
          <Trash2 className="size-4" /> Delete
        </Button>
      </BulkActionBar>

      <PromotionDrawer
        promotion={detail}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={(p) => {
          setDetailOpen(false)
          setDeleteTarget(p)
        }}
        onToggleStatus={toggleStatus}
      />

      <CreatePromotionSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        presetType={preset.type}
        presetScope={preset.scope}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this promotion?"
        description={
          deleteTarget ? (
            <>
              <span className="font-medium text-foreground">{deleteTarget.name}</span>{" "}
              (<span className="font-mono">{deleteTarget.code}</span>) will be
              permanently removed. Past redemptions are unaffected. This cannot be
              undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deletePromotions([deleteTarget.id])
          setDeleteTarget(null)
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} promotions?`}
        description="The selected promotions will be permanently removed. Past redemptions are unaffected. This cannot be undone."
        confirmLabel="Delete all"
        destructive
        onConfirm={() => deletePromotions(selectedIds)}
      />
    </PageContainer>
  )
}
