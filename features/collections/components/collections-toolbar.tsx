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
import { SEASONS } from "@/lib/constants"
import type { SortState } from "@/components/shared/data-table"

export interface CollectionFilters {
  status: string
  type: string
  season: string
  featured: string
}

export type ViewMode = "grid" | "list"

interface CollectionsToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  filters: CollectionFilters
  onFilterChange: (key: keyof CollectionFilters, value: string) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  onClear: () => void
  activeCount: number
}

const SORT_OPTIONS: { value: string; label: string; sort: SortState }[] = [
  { value: "updatedAt:desc", label: "Recently updated", sort: { id: "updatedAt", dir: "desc" } },
  { value: "name:asc", label: "Name: A to Z", sort: { id: "name", dir: "asc" } },
  { value: "productCount:desc", label: "Most products", sort: { id: "productCount", dir: "desc" } },
  { value: "revenue:desc", label: "Top earning", sort: { id: "revenue", dir: "desc" } },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
]

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "manual", label: "Manual" },
  { value: "smart", label: "Smart" },
]

const FEATURED_OPTIONS = [
  { value: "all", label: "All collections" },
  { value: "featured", label: "Featured" },
  { value: "standard", label: "Standard" },
]

export function CollectionsToolbar({
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
}: CollectionsToolbarProps) {
  const sortValue = `${sort.id}:${sort.dir}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search collections…"
            className="h-9 pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange("status", v)}
          >
            <SelectTrigger size="sm" className="h-9 w-[8rem]">
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
            value={filters.type}
            onValueChange={(v) => onFilterChange("type", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[7.5rem] sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.season}
            onValueChange={(v) => onFilterChange("season", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[9.5rem] sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All seasons</SelectItem>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.featured}
            onValueChange={(v) => onFilterChange("featured", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[9rem] md:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEATURED_OPTIONS.map((o) => (
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
              <ToggleGroupItem value="grid" aria-label="Grid view" className="px-2.5">
                <LayoutGrid className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view" className="px-2.5">
                <List className="size-4" />
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
