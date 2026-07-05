"use client"

import { LayoutGrid, List, Search, SlidersHorizontal, Star, X } from "lucide-react"

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

export interface ReviewFilters {
  rating: string
  status: string
  media: string
  reply: string
  category: string
}

export type ReviewsViewMode = "list" | "grid"

interface ReviewsToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  filters: ReviewFilters
  onFilterChange: (key: keyof ReviewFilters, value: string) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
  view: ReviewsViewMode
  onViewChange: (view: ReviewsViewMode) => void
  onClear: () => void
  activeCount: number
  categories: string[]
}

const SORT_OPTIONS: { value: string; label: string; sort: SortState }[] = [
  { value: "createdAt:desc", label: "Newest first", sort: { id: "createdAt", dir: "desc" } },
  { value: "createdAt:asc", label: "Oldest first", sort: { id: "createdAt", dir: "asc" } },
  { value: "rating:desc", label: "Highest rated", sort: { id: "rating", dir: "desc" } },
  { value: "rating:asc", label: "Lowest rated", sort: { id: "rating", dir: "asc" } },
  { value: "helpfulCount:desc", label: "Most helpful", sort: { id: "helpfulCount", dir: "desc" } },
  { value: "reportedCount:desc", label: "Most reported", sort: { id: "reportedCount", dir: "desc" } },
]

const RATING_OPTIONS = [
  { value: "all", label: "All ratings" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "flagged", label: "Flagged" },
  { value: "hidden", label: "Hidden" },
  { value: "rejected", label: "Rejected" },
]

const MEDIA_OPTIONS = [
  { value: "all", label: "Any media" },
  { value: "photos", label: "With photos" },
  { value: "none", label: "No photos" },
]

const REPLY_OPTIONS = [
  { value: "all", label: "Any reply" },
  { value: "replied", label: "Replied" },
  { value: "needs_reply", label: "Needs reply" },
]

export function ReviewsToolbar({
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
  categories,
}: ReviewsToolbarProps) {
  const sortValue = `${sort.id}:${sort.dir}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search customer, product, review ID…"
            className="h-9 pl-9"
            aria-label="Search reviews"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.rating} onValueChange={(v) => onFilterChange("rating", v)}>
            <SelectTrigger size="sm" className="h-9 w-[8.5rem]">
              <Star className="size-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(v) => onFilterChange("status", v)}>
            <SelectTrigger size="sm" className="h-9 w-[8.5rem]">
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

          <Select value={filters.media} onValueChange={(v) => onFilterChange("media", v)}>
            <SelectTrigger size="sm" className="hidden h-9 w-[8.5rem] sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEDIA_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.reply} onValueChange={(v) => onFilterChange("reply", v)}>
            <SelectTrigger size="sm" className="hidden h-9 w-[8.5rem] md:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPLY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={(v) => onFilterChange("category", v)}>
            <SelectTrigger size="sm" className="hidden h-9 w-[9rem] xl:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
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
              <SelectTrigger size="sm" className="h-9 w-[10.5rem]">
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
              onValueChange={(v) => v && onViewChange(v as ReviewsViewMode)}
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
