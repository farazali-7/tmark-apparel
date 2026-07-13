"use client"

import * as React from "react"
import { toast } from "sonner"
import { Archive, Download, Sparkles, Trash2, Upload } from "lucide-react"

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
import type { CollectionAction } from "@/features/collections/components/collection-actions"
import { CollectionDetailsDrawer } from "@/features/collections/components/collection-details-drawer"
import { CollectionHero } from "@/features/collections/components/collection-hero"
import { CollectionsGrid } from "@/features/collections/components/collections-grid"
import { CollectionsSummary } from "@/features/collections/components/collections-summary"
import { CollectionsTable } from "@/features/collections/components/collections-table"
import {
  CollectionsToolbar,
  type CollectionFilters,
  type ViewMode,
} from "@/features/collections/components/collections-toolbar"
import { CreateCollectionForm } from "@/features/collections/components/create-collection-form"
import { FeaturedCarousel } from "@/features/collections/components/featured-carousel"
import { collections as seedCollections } from "@/lib/mock-data/collections"
import type { Collection } from "@/types"

const DEFAULT_FILTERS: CollectionFilters = {
  status: "all",
  type: "all",
  season: "all",
  featured: "all",
}

export function CollectionsView() {
  const [items, setItems] = React.useState<Collection[]>(seedCollections)
  const [loading, setLoading] = React.useState(true)

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<CollectionFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = React.useState<SortState>({
    id: "updatedAt",
    dir: "desc",
  })
  const [view, setView] = React.useState<ViewMode>("grid")

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(9)

  const [detailCollection, setDetailCollection] = React.useState<Collection | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<Collection | null>(null)
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
      setCreateOpen(true)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const hero = React.useMemo(
    () =>
      items.find((c) => c.featured && c.status === "published") ??
      items.find((c) => c.featured) ??
      items[0],
    [items]
  )
  const featured = React.useMemo(
    () => items.filter((c) => c.featured && c.id !== hero?.id),
    [items, hero]
  )

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (query) count++
    ;(Object.keys(filters) as (keyof CollectionFilters)[]).forEach((k) => {
      if (filters[k] !== "all") count++
    })
    return count
  }, [query, filters])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = items.filter((c) => {
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.subtitle.toLowerCase().includes(q) &&
        !c.slug.toLowerCase().includes(q)
      )
        return false
      if (filters.status !== "all" && c.status !== filters.status) return false
      if (filters.type !== "all" && c.type !== filters.type) return false
      if (filters.season !== "all" && c.season !== filters.season) return false
      if (filters.featured === "featured" && !c.featured) return false
      if (filters.featured === "standard" && c.featured) return false
      return true
    })

    const dir = sort.dir === "asc" ? 1 : -1
    result.sort((a, b) => {
      switch (sort.id) {
        case "name":
          return a.name.localeCompare(b.name) * dir
        case "productCount":
          return (a.productCount - b.productCount) * dir
        case "revenue":
          return (a.revenue - b.revenue) * dir
        default:
          return (
            (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) *
            dir
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
        : { id, dir: "asc" }
    )
  }

  function openDetails(collection: Collection) {
    setDetailCollection(collection)
    setDetailOpen(true)
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function deleteCollections(ids: string[]) {
    setItems((prev) => prev.filter((c) => !ids.includes(c.id)))
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(
      ids.length > 1 ? `${ids.length} collections deleted` : "Collection deleted"
    )
  }

  function patchItems(ids: string[], patch: (c: Collection) => Partial<Collection>) {
    const now = new Date().toISOString()
    setItems((prev) =>
      prev.map((c) =>
        ids.includes(c.id) ? { ...c, ...patch(c), updatedAt: now } : c
      )
    )
  }

  function archiveCollections(ids: string[]) {
    // An archived campaign leaves the storefront entirely, so it also loses
    // its featured slot — otherwise it would linger in the hero.
    patchItems(ids, () => ({
      status: "archived",
      featured: false,
      visibility: "hidden",
    }))
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(
      ids.length > 1 ? `${ids.length} collections archived` : "Collection archived"
    )
  }

  function handleRowAction(action: CollectionAction, collection: Collection) {
    switch (action) {
      case "feature":
        patchItems([collection.id], (c) => ({ featured: !c.featured }))
        toast.success(
          collection.featured
            ? `Removed “${collection.name}” from featured`
            : `“${collection.name}” marked as featured`
        )
        break
      case "toggle-visibility":
        patchItems([collection.id], (c) => ({
          visibility: c.visibility === "visible" ? "hidden" : "visible",
        }))
        toast.success(
          collection.visibility === "visible"
            ? `“${collection.name}” hidden from the storefront`
            : `“${collection.name}” is visible on the storefront`
        )
        break
      case "archive":
        archiveCollections([collection.id])
        break
      case "restore":
        patchItems([collection.id], () => ({ status: "draft" }))
        toast.success(`“${collection.name}” restored to draft`)
        break
      case "duplicate": {
        const now = new Date().toISOString()
        setItems((prev) => [
          {
            ...collection,
            id: `col_${Date.now()}`,
            name: `${collection.name} (Copy)`,
            slug: `${collection.slug}-copy`,
            status: "draft",
            visibility: "hidden",
            featured: false,
            revenue: 0,
            views: 0,
            conversion: 0,
            scheduledFor: null,
            createdAt: now,
            updatedAt: now,
            activity: [
              {
                id: "a1",
                label: `Duplicated from ${collection.name}`,
                timestamp: now,
              },
            ],
          },
          ...prev,
        ])
        toast.success(`Duplicated “${collection.name}” as a draft`)
        break
      }
    }
  }

  function handleCreate(collection: Collection) {
    setItems((prev) => [collection, ...prev])
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
  function handleFilterChange(key: keyof CollectionFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }
  function handleViewChange(next: ViewMode) {
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
      icon={Sparkles}
      title={isFiltered ? "No matching collections" : "No collections yet."}
      description={
        isFiltered
          ? "Try adjusting your search or filters."
          : "Build your first merchandising campaign to feature on the storefront."
      }
      action={
        isFiltered ? (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Sparkles className="size-4" /> Create First Collection
          </Button>
        )
      }
    />
  )

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        eyebrow="Catalog / Collections"
        title="Collections"
        description="Curate seasonal campaigns and merchandising stories for the storefront."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast("Import coming soon")}>
              <Upload className="size-4" /> Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Collections exported")}
            >
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Sparkles className="size-4" /> Create Collection
            </Button>
          </>
        }
      />

      {/* Marketing-first: hero + featured carousel lead the page */}
      {loading ? (
        <Skeleton className="h-[19rem] w-full rounded-2xl" />
      ) : hero ? (
        <CollectionHero collection={hero} onView={openDetails} />
      ) : null}

      {!loading ? (
        <FeaturedCarousel collections={featured} onView={openDetails} />
      ) : null}

      <CollectionsSummary collections={items} loading={loading} />

      <section className="space-y-4">
        <SectionHeader
          title="All Collections"
          description="Every campaign — live, scheduled, draft and archived"
        />
        <div className="space-y-4 rounded-xl border bg-card p-3 sm:p-4">
          <CollectionsToolbar
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
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            ) : paged.length === 0 ? (
              emptyState
            ) : (
              <CollectionsGrid
                data={paged}
                selectedIds={selectedIds}
                onSelectToggle={toggleOne}
                onView={openDetails}
                onDelete={setDeleteTarget}
                onAction={handleRowAction}
              />
            )
          ) : (
            <CollectionsTable
              data={paged}
              loading={loading}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              sort={sort}
              onSortChange={handleSortColumn}
              onView={openDetails}
              onDelete={setDeleteTarget}
              onAction={handleRowAction}
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
                pageSizeOptions={[9, 18, 27]}
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
          onClick={() => archiveCollections(selectedIds)}
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

      <CollectionDetailsDrawer
        collection={detailCollection}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={(c) => {
          setDetailOpen(false)
          setDeleteTarget(c)
        }}
      />

      <CreateCollectionForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete collection?"
        description={
          deleteTarget ? (
            <>
              <span className="font-medium text-foreground">
                {deleteTarget.name}
              </span>{" "}
              will be permanently removed from the storefront. Products are not
              affected. This action cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteCollections([deleteTarget.id])
          setDeleteTarget(null)
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} collections?`}
        description="The selected collections will be permanently removed. Products are not affected. This action cannot be undone."
        confirmLabel="Delete all"
        destructive
        onConfirm={() => deleteCollections(selectedIds)}
      />
    </PageContainer>
  )
}
