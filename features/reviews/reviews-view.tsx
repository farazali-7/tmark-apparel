"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Check,
  Download,
  EyeOff,
  MessageSquareQuote,
  RefreshCw,
  SearchX,
  Settings2,
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
import { PhotoGallery } from "@/features/reviews/components/photo-gallery"
import { ReputationOverview } from "@/features/reviews/components/reputation-overview"
import { ReviewDrawer } from "@/features/reviews/components/review-drawer"
import { ReviewsGrid } from "@/features/reviews/components/reviews-grid"
import { ReviewsSummary } from "@/features/reviews/components/reviews-summary"
import { ReviewsTable } from "@/features/reviews/components/reviews-table"
import {
  ReviewsToolbar,
  type ReviewFilters,
  type ReviewsViewMode,
} from "@/features/reviews/components/reviews-toolbar"
import { reviewDetails as seedReviews } from "@/lib/mock-data/reviews-detail"
import type { ReviewDetail, ReviewModerationStatus } from "@/types"

const DEFAULT_FILTERS: ReviewFilters = {
  rating: "all",
  status: "all",
  media: "all",
  reply: "all",
  category: "all",
}

export function ReviewsView() {
  const [items, setItems] = React.useState<ReviewDetail[]>(seedReviews)
  const [loading, setLoading] = React.useState(true)

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<ReviewFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = React.useState<SortState>({ id: "createdAt", dir: "desc" })
  const [view, setView] = React.useState<ReviewsViewMode>("list")

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(8)

  const [detailReview, setDetailReview] = React.useState<ReviewDetail | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<ReviewDetail | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  const categories = React.useMemo(
    () => Array.from(new Set(items.map((r) => r.product.category))).sort(),
    [items]
  )

  const activeRating =
    filters.rating !== "all" ? Number(filters.rating) : null

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (query) count++
    ;(Object.keys(filters) as (keyof ReviewFilters)[]).forEach((k) => {
      if (filters[k] !== "all") count++
    })
    return count
  }, [query, filters])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = items.filter((r) => {
      if (q) {
        const haystack = [
          r.reference,
          r.customer.name,
          r.product.name,
          r.title,
          r.body,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (filters.rating !== "all" && r.rating !== Number(filters.rating))
        return false
      if (filters.status !== "all" && r.status !== filters.status) return false
      if (filters.media === "photos" && r.photos.length === 0) return false
      if (filters.media === "none" && r.photos.length > 0) return false
      if (filters.reply === "replied" && !r.reply) return false
      if (filters.reply === "needs_reply" && r.reply) return false
      if (filters.category !== "all" && r.product.category !== filters.category)
        return false
      return true
    })

    const dir = sort.dir === "asc" ? 1 : -1
    result.sort((a, b) => {
      switch (sort.id) {
        case "rating":
          return (a.rating - b.rating) * dir
        case "helpfulCount":
          return (a.helpfulCount - b.helpfulCount) * dir
        case "reportedCount":
          return (a.reportedCount - b.reportedCount) * dir
        default:
          return (
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
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
        : { id, dir: "desc" }
    )
  }

  function openDetails(review: ReviewDetail) {
    setDetailReview(review)
    setDetailOpen(true)
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function deleteReviews(ids: string[]) {
    setItems((prev) => prev.filter((r) => !ids.includes(r.id)))
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(
      ids.length > 1 ? `${ids.length} reviews deleted` : "Review deleted"
    )
  }

  function moderateSelected(status: ReviewModerationStatus, label: string) {
    setItems((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status } : r))
    )
    toast.success(`${selectedIds.length} reviews ${label}`)
    setSelectedIds([])
  }

  function handleRefresh() {
    setLoading(true)
    setSelectedIds([])
    setTimeout(() => {
      setLoading(false)
      toast.success("Reviews refreshed")
    }, 500)
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
  function handleFilterChange(key: keyof ReviewFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }
  function handleSelectRating(rating: number | null) {
    setFilters((prev) => ({ ...prev, rating: rating ? String(rating) : "all" }))
    setPage(1)
  }
  function handleViewChange(next: ReviewsViewMode) {
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
      icon={isFiltered ? SearchX : MessageSquareQuote}
      title={isFiltered ? "No matching reviews" : "No reviews found."}
      description={
        isFiltered
          ? "Try adjusting your search, rating or moderation filters."
          : "Approved reviews from delivered orders will appear here for moderation."
      }
      action={
        isFiltered ? (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={handleRefresh}>
            <RefreshCw className="size-4" /> Refresh Reviews
          </Button>
        )
      }
    />
  )

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        eyebrow="Commerce / Reviews"
        title="Reviews"
        description="Manage customer feedback, product reputation and review moderation."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              aria-label="Refresh reviews"
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
              onClick={() => toast.success("Reviews exported to CSV")}
            >
              <Download className="size-4" /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast("Review settings")}
            >
              <Settings2 className="size-4" /> Settings
            </Button>
          </>
        }
      />

      <ReviewsSummary reviews={items} loading={loading} />

      <ReputationOverview
        reviews={items}
        activeRating={activeRating}
        onSelectRating={handleSelectRating}
        loading={loading}
      />

      <PhotoGallery reviews={items} onOpenReview={openDetails} loading={loading} />

      <section className="space-y-4">
        <SectionHeader
          title="All Reviews"
          description="Moderate feedback, reply to customers and manage reputation"
        />
        <div className="space-y-4 rounded-xl border bg-card p-3 sm:p-4">
          <ReviewsToolbar
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
            categories={categories}
          />

          <Separator />

          {view === "grid" ? (
            loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-60 rounded-xl" />
                ))}
              </div>
            ) : paged.length === 0 ? (
              emptyState
            ) : (
              <ReviewsGrid
                data={paged}
                selectedIds={selectedIds}
                onSelectToggle={toggleOne}
                onView={openDetails}
                onDelete={setDeleteTarget}
              />
            )
          ) : (
            <ReviewsTable
              data={paged}
              loading={loading}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              sort={sort}
              onSortChange={handleSortColumn}
              onView={openDetails}
              onDelete={setDeleteTarget}
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
          onClick={() => moderateSelected("approved", "approved")}
        >
          <Check className="size-4" /> Approve
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => moderateSelected("hidden", "hidden")}
        >
          <EyeOff className="size-4" /> Hide
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

      <ReviewDrawer
        review={detailReview}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={(r) => {
          setDetailOpen(false)
          setDeleteTarget(r)
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this review?"
        description={
          deleteTarget ? (
            <>
              The review by{" "}
              <span className="font-medium text-foreground">
                {deleteTarget.customer.name}
              </span>{" "}
              will be permanently removed from the storefront. This cannot be
              undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteReviews([deleteTarget.id])
          setDeleteTarget(null)
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} reviews?`}
        description="The selected reviews will be permanently removed from the storefront. This cannot be undone."
        confirmLabel="Delete all"
        destructive
        onConfirm={() => deleteReviews(selectedIds)}
      />
    </PageContainer>
  )
}
