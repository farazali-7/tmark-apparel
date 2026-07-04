"use client"

import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { CATEGORIES, COLLECTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { SortState } from "@/components/shared/data-table"

export interface ProductFilters {
  category: string
  collection: string
  status: string
  stock: string
}

export type ViewMode = "list" | "grid"

interface ProductsToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  filters: ProductFilters
  onFilterChange: (key: keyof ProductFilters, value: string) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  onClear: () => void
  activeCount: number
}

const SORT_OPTIONS: { value: string; label: string; sort: SortState }[] = [
  { value: "createdAt:desc", label: "Newest first", sort: { id: "createdAt", dir: "desc" } },
  { value: "createdAt:asc", label: "Oldest first", sort: { id: "createdAt", dir: "asc" } },
  { value: "price:desc", label: "Price: high to low", sort: { id: "price", dir: "desc" } },
  { value: "price:asc", label: "Price: low to high", sort: { id: "price", dir: "asc" } },
  { value: "name:asc", label: "Name: A to Z", sort: { id: "name", dir: "asc" } },
  { value: "stock:asc", label: "Stock: low to high", sort: { id: "stock", dir: "asc" } },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
]

const STOCK_OPTIONS = [
  { value: "all", label: "All stock" },
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
]

export function ProductsToolbar({
  query,
  onQueryChange,
  filters,
  onFilterChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  onClear,
  activeCount,
}: ProductsToolbarProps) {
  const sortValue = `${sort.id}:${sort.dir}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search products or SKU…"
            className="h-9 pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.category}
            onValueChange={(v) => onFilterChange("category", v)}
          >
            <SelectTrigger size="sm" className="h-9 w-[9.5rem]">
              <SlidersHorizontal className="size-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.collection}
            onValueChange={(v) => onFilterChange("collection", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[10rem] sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All collections</SelectItem>
              {COLLECTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange("status", v)}
          >
            <SelectTrigger size="sm" className="h-9 w-[7.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.stock}
            onValueChange={(v) => onFilterChange("stock", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[7.5rem] md:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STOCK_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Select
              value={sortValue}
              onValueChange={(v) => {
                const opt = SORT_OPTIONS.find((o) => o.value === v)
                if (opt) onSortChange(opt.sort)
              }}
            >
              <SelectTrigger size="sm" className="h-9 w-[11rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => v && onViewChange(v as ViewMode)}
              variant="outline"
              size="sm"
              className="h-9"
            >
              <ToggleGroupItem value="list" aria-label="List view" className="px-2.5">
                <List className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view" className="px-2.5">
                <LayoutGrid className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {activeCount > 0 ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {activeCount} filter{activeCount > 1 ? "s" : ""} applied
          </span>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClear}
            className={cn("text-xs text-muted-foreground")}
          >
            <X className="size-3" /> Clear all
          </Button>
        </div>
      ) : null}
    </div>
  )
}
