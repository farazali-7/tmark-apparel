"use client"

import * as React from "react"
import { toast } from "sonner"
import { Download, EyeOff, FolderPlus, Trash2, Upload } from "lucide-react"

import { BulkActionBar } from "@/components/shared/bulk-action-bar"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { SortState } from "@/components/shared/data-table"
import { CategoriesGrid } from "@/features/categories/components/categories-grid"
import { CategoriesSummary } from "@/features/categories/components/categories-summary"
import { CategoriesTable } from "@/features/categories/components/categories-table"
import {
  CategoriesToolbar,
  type CategoryFilters,
  type ViewMode,
} from "@/features/categories/components/categories-toolbar"
import { CategoryDetailsDrawer } from "@/features/categories/components/category-details-drawer"
import { CreateCategoryForm } from "@/features/categories/components/create-category-form"
import { categories as seedCategories } from "@/lib/mock-data/categories"
import { formatNumber } from "@/lib/constants"
import type { Category } from "@/types"

const DEFAULT_FILTERS: CategoryFilters = {
  status: "all",
  visibility: "all",
  products: "all",
}

function matchesProducts(c: Category, filter: string) {
  if (filter === "all") return true
  if (filter === "has") return c.productCount > 0
  if (filter === "empty") return c.productCount === 0
  return true
}

export function CategoriesView() {
  const [items, setItems] = React.useState<Category[]>(seedCategories)
  const [loading, setLoading] = React.useState(true)

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<CategoryFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = React.useState<SortState>({
    id: "displayOrder",
    dir: "asc",
  })
  const [view, setView] = React.useState<ViewMode>("list")

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const [detailCategory, setDetailCategory] = React.useState<Category | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null)
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

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (query) count++
    ;(Object.keys(filters) as (keyof CategoryFilters)[]).forEach((k) => {
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
        !c.slug.toLowerCase().includes(q)
      )
        return false
      if (filters.status !== "all" && c.status !== filters.status) return false
      if (filters.visibility !== "all" && c.visibility !== filters.visibility)
        return false
      if (!matchesProducts(c, filters.products)) return false
      return true
    })

    const dir = sort.dir === "asc" ? 1 : -1
    result.sort((a, b) => {
      switch (sort.id) {
        case "name":
          return a.name.localeCompare(b.name) * dir
        case "productCount":
          return (a.productCount - b.productCount) * dir
        case "updatedAt":
          return (
            (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) *
            dir
          )
        default:
          return (a.displayOrder - b.displayOrder) * dir
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

  function openDetails(category: Category) {
    setDetailCategory(category)
    setDetailOpen(true)
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function deleteCategories(ids: string[]) {
    setItems((prev) => prev.filter((c) => !ids.includes(c.id)))
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(
      ids.length > 1 ? `${ids.length} categories deleted` : "Category deleted"
    )
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

  function handleFilterChange(key: keyof CategoryFilters, value: string) {
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
      icon={FolderPlus}
      title={isFiltered ? "No matching categories" : "No categories created yet."}
      description={
        isFiltered
          ? "Try adjusting your search or filters."
          : "Group your products into categories to organize the catalog."
      }
      action={
        isFiltered ? (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <FolderPlus className="size-4" /> Create First Category
          </Button>
        )
      }
    />
  )

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        eyebrow="Catalog / Categories"
        title="Categories"
        description="Organize your catalog into categories and manage product organization."
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
              onClick={() => toast.success("Categories exported")}
            >
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <FolderPlus className="size-4" /> Create Category
            </Button>
          </>
        }
      />

      <CategoriesSummary categories={items} loading={loading} />

      <div className="space-y-4 rounded-xl border bg-card p-3 sm:p-4">
        <CategoriesToolbar
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

        {view === "list" ? (
          <CategoriesTable
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
        ) : loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-xl border bg-muted/40"
              />
            ))}
          </div>
        ) : paged.length === 0 ? (
          emptyState
        ) : (
          <CategoriesGrid
            data={paged}
            selectedIds={selectedIds}
            onSelectToggle={toggleOne}
            onView={openDetails}
            onDelete={setDeleteTarget}
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
            />
          </>
        ) : null}
      </div>

      <BulkActionBar count={selectedIds.length} onClear={() => setSelectedIds([])}>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => toast.success(`${selectedIds.length} categories hidden`)}
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

      <CategoryDetailsDrawer
        category={detailCategory}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={(c) => {
          setDetailOpen(false)
          setDeleteTarget(c)
        }}
      />

      <CreateCategoryForm open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete category?"
        description={
          deleteTarget ? (
            <>
              <span className="font-medium text-foreground">
                {deleteTarget.name}
              </span>{" "}
              will be permanently removed
              {deleteTarget.productCount > 0
                ? ` and ${formatNumber(deleteTarget.productCount)} products will be uncategorized`
                : ""}
              . This action cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteCategories([deleteTarget.id])
          setDeleteTarget(null)
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} categories?`}
        description="The selected categories will be permanently removed. This action cannot be undone."
        confirmLabel="Delete all"
        destructive
        onConfirm={() => deleteCategories(selectedIds)}
      />
    </PageContainer>
  )
}
