"use client"

import * as React from "react"
import { toast } from "sonner"
import { Download, PackagePlus, PackageX, Star, Trash2, Upload } from "lucide-react"

import { BulkActionBar } from "@/components/shared/bulk-action-bar"
import { EmptyState } from "@/components/shared/empty-state"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { SortState } from "@/components/shared/data-table"
import { AddProductForm } from "@/features/products/components/add-product-form"
import { ProductDetailsDrawer } from "@/features/products/components/product-details-drawer"
import { ProductsGrid } from "@/features/products/components/products-grid"
import { ProductsTable } from "@/features/products/components/products-table"
import {
  ProductsToolbar,
  type ProductFilters,
  type ViewMode,
} from "@/features/products/components/products-toolbar"
import { products as seedProducts } from "@/lib/mock-data/products"
import { formatNumber } from "@/lib/constants"
import type { Product } from "@/types"

const DEFAULT_FILTERS: ProductFilters = {
  category: "all",
  collection: "all",
  status: "all",
  stock: "all",
}

function effectivePrice(p: Product) {
  return p.salePrice ?? p.price
}

function matchesStock(p: Product, stock: string) {
  if (stock === "all") return true
  if (stock === "out_of_stock") return p.stock === 0
  if (stock === "low_stock") return p.stock > 0 && p.stock <= p.lowStockThreshold
  if (stock === "in_stock") return p.stock > p.lowStockThreshold
  return true
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-xl border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display text-xl font-medium tabular">{value}</p>
    </div>
  )
}

export function ProductsView() {
  const [items, setItems] = React.useState<Product[]>(seedProducts)
  const [loading, setLoading] = React.useState(true)

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<ProductFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = React.useState<SortState>({ id: "createdAt", dir: "desc" })
  const [view, setView] = React.useState<ViewMode>("list")

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const [detailProduct, setDetailProduct] = React.useState<Product | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [addOpen, setAddOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (query) count++
    ;(Object.keys(filters) as (keyof ProductFilters)[]).forEach((k) => {
      if (filters[k] !== "all") count++
    })
    return count
  }, [query, filters])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = items.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q))
        return false
      if (filters.category !== "all" && p.category !== filters.category) return false
      if (filters.collection !== "all" && p.collection !== filters.collection)
        return false
      if (filters.status !== "all" && p.status !== filters.status) return false
      if (!matchesStock(p, filters.stock)) return false
      return true
    })

    const dir = sort.dir === "asc" ? 1 : -1
    result.sort((a, b) => {
      switch (sort.id) {
        case "name":
          return a.name.localeCompare(b.name) * dir
        case "price":
          return (effectivePrice(a) - effectivePrice(b)) * dir
        case "stock":
          return (a.stock - b.stock) * dir
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

  const stats = React.useMemo(() => {
    const active = items.filter((p) => p.status === "active").length
    const low = items.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold)
      .length
    const out = items.filter((p) => p.stock === 0).length
    return { total: items.length, active, low, out }
  }, [items])

  function handleSortColumn(id: string) {
    setSort((prev) =>
      prev.id === id
        ? { id, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { id, dir: "asc" }
    )
  }

  function openDetails(product: Product) {
    setDetailProduct(product)
    setDetailOpen(true)
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function deleteProducts(ids: string[]) {
    setItems((prev) => prev.filter((p) => !ids.includes(p.id)))
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    toast.success(
      ids.length > 1 ? `${ids.length} products deleted` : "Product deleted"
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

  function handleFilterChange(key: keyof ProductFilters, value: string) {
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
      icon={PackageX}
      title={isFiltered ? "No matching products" : "No products yet"}
      description={
        isFiltered
          ? "Try adjusting your search or filters."
          : "Add your first product to get started."
      }
      action={
        isFiltered ? (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <PackagePlus className="size-4" /> Add product
          </Button>
        )
      }
    />
  )

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description={`${formatNumber(stats.total)} products across ${
          new Set(items.map((p) => p.category)).size
        } categories`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast("Import coming soon")}>
              <Upload className="size-4" /> Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Catalog exported")}
            >
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <PackagePlus className="size-4" /> Add Product
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <StatTile label="Total products" value={formatNumber(stats.total)} />
        <StatTile label="Active" value={formatNumber(stats.active)} />
        <StatTile label="Low stock" value={formatNumber(stats.low)} />
        <StatTile label="Out of stock" value={formatNumber(stats.out)} />
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-3 sm:p-4">
        <ProductsToolbar
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
          <ProductsTable
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-4/5 animate-pulse rounded-xl border bg-muted/40"
              />
            ))}
          </div>
        ) : paged.length === 0 ? (
          emptyState
        ) : (
          <ProductsGrid
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
          onClick={() => toast.success(`${selectedIds.length} featured`)}
        >
          <Star className="size-4" /> Feature
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

      <ProductDetailsDrawer
        product={detailProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={(p) => {
          setDetailOpen(false)
          setDeleteTarget(p)
        }}
      />

      <AddProductForm open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete product?"
        description={
          deleteTarget ? (
            <>
              <span className="font-medium text-foreground">
                {deleteTarget.name}
              </span>{" "}
              will be permanently removed. This action cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteProducts([deleteTarget.id])
          setDeleteTarget(null)
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} products?`}
        description="The selected products will be permanently removed. This action cannot be undone."
        confirmLabel="Delete all"
        destructive
        onConfirm={() => deleteProducts(selectedIds)}
      />
    </PageContainer>
  )
}
