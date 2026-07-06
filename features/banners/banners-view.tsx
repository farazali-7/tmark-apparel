"use client"

import * as React from "react"
import { toast } from "sonner"
import { Archive, Eye, ImageOff, Plus, SearchX, Trash2 } from "lucide-react"

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
import { BannersGrid } from "@/features/banners/components/banners-grid"
import { BannersSummary } from "@/features/banners/components/banners-summary"
import {
  BannersToolbar,
  type BannerFilters,
} from "@/features/banners/components/banners-toolbar"
import { CampaignTimeline } from "@/features/banners/components/campaign-timeline"
import { CreateBannerDrawer } from "@/features/banners/components/create-banner-drawer"
import { bannerPhase, type BannerPhase } from "@/features/banners/phase"
import { banners as seedBanners } from "@/lib/mock-data/banners"
import type { Banner, BannerStatus } from "@/types"

const DEFAULT_FILTERS: BannerFilters = { status: "all", type: "all", sort: "recent" }
const PRIORITY_RANK: Record<string, number> = { low: 0, medium: 1, high: 2 }

export function BannersView() {
  const [items, setItems] = React.useState<Banner[]>(seedBanners)
  const [loading, setLoading] = React.useState(true)

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<BannerFilters>(DEFAULT_FILTERS)
  const [phase, setPhase] = React.useState<BannerPhase | null>(null)

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(9)

  const [drawerBanner, setDrawerBanner] = React.useState<Banner | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<Banner | null>(null)
  const [archiveTarget, setArchiveTarget] = React.useState<Banner | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "c" || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return
      e.preventDefault()
      openCreate()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (query) count++
    if (phase) count++
    if (filters.status !== "all") count++
    if (filters.type !== "all") count++
    return count
  }, [query, filters, phase])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = items.filter((b) => {
      if (q && !`${b.name} ${b.subtitle} ${b.headline} ${b.targetPage}`.toLowerCase().includes(q))
        return false
      if (filters.status !== "all" && b.status !== filters.status) return false
      if (filters.type !== "all" && b.type !== filters.type) return false
      if (phase && bannerPhase(b) !== phase) return false
      return true
    })

    result.sort((a, b) => {
      switch (filters.sort) {
        case "priority":
          return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]
        case "startDate":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case "impressions":
          return b.impressions - a.impressions
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })
    return result
  }, [items, query, filters, phase])

  const paged = React.useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  )

  function openCreate() {
    setDrawerBanner(null)
    setDrawerOpen(true)
  }
  function openEdit(banner: Banner) {
    setDrawerBanner(banner)
    setDrawerOpen(true)
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function archiveBanners(ids: string[]) {
    setItems((prev) =>
      prev.map((b) => (ids.includes(b.id) ? { ...b, status: "archived" as BannerStatus } : b))
    )
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(ids.length > 1 ? `${ids.length} campaigns archived` : "Campaign archived")
  }
  function deleteBanners(ids: string[]) {
    setItems((prev) => prev.filter((b) => !ids.includes(b.id)))
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(ids.length > 1 ? `${ids.length} campaigns deleted` : "Campaign deleted")
  }

  function clearFilters() {
    setQuery("")
    setFilters(DEFAULT_FILTERS)
    setPhase(null)
    setPage(1)
  }
  function handleFilterChange(key: keyof BannerFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }
  function handlePhase(next: BannerPhase | null) {
    setPhase(next)
    setPage(1)
  }

  const isFiltered = activeFilterCount > 0
  const emptyState = (
    <div className="rounded-2xl border">
      <EmptyState
        icon={isFiltered ? SearchX : ImageOff}
        title={isFiltered ? "No matching campaigns" : "No campaigns yet."}
        description={
          isFiltered
            ? "Try adjusting your search, filters or the selected phase."
            : "Create your first banner campaign to feature across the storefront."
        }
        action={
          isFiltered ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : (
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" /> Create Banner
            </Button>
          )
        }
      />
    </div>
  )

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        eyebrow="Storefront / Campaigns"
        title="Banner Manager"
        description="Manage promotional campaigns and homepage banners."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Opened storefront preview")}>
              <Eye className="size-4" /> Preview Website
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" /> Create Banner
            </Button>
          </>
        }
      />

      <BannersSummary banners={items} loading={loading} />

      <CampaignTimeline banners={items} active={phase} onSelect={handlePhase} loading={loading} />

      <section className="space-y-4">
        <SectionHeader
          title="All Campaigns"
          description="Every banner across the homepage, categories and collections"
        />
        <BannersToolbar
          query={query}
          onQueryChange={(v) => {
            setQuery(v)
            setPage(1)
          }}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={clearFilters}
          activeCount={activeFilterCount}
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : paged.length === 0 ? (
          emptyState
        ) : (
          <BannersGrid
            data={paged}
            selectedIds={selectedIds}
            onSelectToggle={toggleOne}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onArchive={setArchiveTarget}
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
              onPageSizeChange={(s) => {
                setPageSize(s)
                setPage(1)
              }}
              pageSizeOptions={[9, 18, 27]}
            />
          </>
        ) : null}
      </section>

      <BulkActionBar count={selectedIds.length} onClear={() => setSelectedIds([])}>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => archiveBanners(selectedIds)}
        >
          <Archive className="size-4" /> Archive
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

      <CreateBannerDrawer open={drawerOpen} onOpenChange={setDrawerOpen} banner={drawerBanner} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this campaign?"
        description={
          deleteTarget ? (
            <>
              <span className="font-medium text-foreground">{deleteTarget.name}</span> will
              be permanently removed. This cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteBanners([deleteTarget.id])
          setDeleteTarget(null)
        }}
      />

      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(o) => !o && setArchiveTarget(null)}
        title="Archive this campaign?"
        description={
          archiveTarget ? (
            <>
              <span className="font-medium text-foreground">{archiveTarget.name}</span> will
              be moved to archived and hidden from the storefront.
            </>
          ) : null
        }
        confirmLabel="Archive"
        onConfirm={() => {
          if (archiveTarget) archiveBanners([archiveTarget.id])
          setArchiveTarget(null)
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} campaigns?`}
        description="The selected campaigns will be permanently removed. This cannot be undone."
        confirmLabel="Delete all"
        destructive
        onConfirm={() => deleteBanners(selectedIds)}
      />
    </PageContainer>
  )
}
