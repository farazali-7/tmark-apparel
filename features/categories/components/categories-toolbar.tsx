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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { SortState } from "@/components/shared/data-table"

export interface CategoryFilters {
  status: string
  visibility: string
  products: string
}

export type ViewMode = "list" | "grid"

interface CategoriesToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  filters: CategoryFilters
  onFilterChange: (key: keyof CategoryFilters, value: string) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  onClear: () => void
  activeCount: number
}

const SORT_OPTIONS: { value: string; label: string; sort: SortState }[] = [
  { value: "displayOrder:asc", label: "Display order", sort: { id: "displayOrder", dir: "asc" } },
  { value: "updatedAt:desc", label: "Recently updated", sort: { id: "updatedAt", dir: "desc" } },
  { value: "name:asc", label: "Name: A to Z", sort: { id: "name", dir: "asc" } },
  { value: "productCount:desc", label: "Most products", sort: { id: "productCount", dir: "desc" } },
  { value: "productCount:asc", label: "Fewest products", sort: { id: "productCount", dir: "asc" } },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
]

const VISIBILITY_OPTIONS = [
  { value: "all", label: "All visibility" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
]

const PRODUCTS_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "has", label: "With products" },
  { value: "empty", label: "Empty" },
]

export function CategoriesToolbar({
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
}: CategoriesToolbarProps) {
  const sortValue = `${sort.id}:${sort.dir}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search categories or slug…"
            className="h-9 pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange("status", v)}
          >
            <SelectTrigger size="sm" className="h-9 w-[7.5rem]">
              <SlidersHorizontal className="size-3.5 text-muted-foreground" />
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
            value={filters.visibility}
            onValueChange={(v) => onFilterChange("visibility", v)}
          >
            <SelectTrigger size="sm" className="h-9 w-[8.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.products}
            onValueChange={(v) => onFilterChange("products", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[9rem] md:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS_OPTIONS.map((o) => (
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
            className="text-xs text-muted-foreground"
          >
            <X className="size-3" /> Clear all
          </Button>
        </div>
      ) : null}
    </div>
  )
}
