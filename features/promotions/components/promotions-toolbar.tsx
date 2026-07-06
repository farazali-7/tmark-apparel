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

export interface PromotionFilters {
  status: string
  type: string
  scope: string
  usage: string
}

export type PromotionsViewMode = "list" | "grid"

interface PromotionsToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  filters: PromotionFilters
  onFilterChange: (key: keyof PromotionFilters, value: string) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
  view: PromotionsViewMode
  onViewChange: (view: PromotionsViewMode) => void
  onClear: () => void
  activeCount: number
}

const SORT_OPTIONS: { value: string; label: string; sort: SortState }[] = [
  { value: "createdAt:desc", label: "Newest first", sort: { id: "createdAt", dir: "desc" } },
  { value: "endDate:asc", label: "Ending soonest", sort: { id: "endDate", dir: "asc" } },
  { value: "usedCount:desc", label: "Most redeemed", sort: { id: "usedCount", dir: "desc" } },
  { value: "revenue:desc", label: "Top revenue", sort: { id: "revenue", dir: "desc" } },
  { value: "name:asc", label: "Name: A to Z", sort: { id: "name", dir: "asc" } },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "paused", label: "Paused" },
  { value: "expired", label: "Expired" },
  { value: "draft", label: "Draft" },
]

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "percentage", label: "Percentage" },
  { value: "fixed", label: "Fixed amount" },
  { value: "free_shipping", label: "Free shipping" },
  { value: "buy_x_get_y", label: "Buy X get Y" },
  { value: "bundle", label: "Bundle" },
]

const SCOPE_OPTIONS = [
  { value: "all", label: "Applies to all" },
  { value: "entire_store", label: "Entire store" },
  { value: "category", label: "Category" },
  { value: "collection", label: "Collection" },
  { value: "product", label: "Products" },
  { value: "vip", label: "VIP customers" },
]

const USAGE_OPTIONS = [
  { value: "all", label: "Any usage" },
  { value: "high", label: "Most used (100+)" },
  { value: "low", label: "Low (≤ 10)" },
  { value: "never", label: "Never used" },
]

export function PromotionsToolbar({
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
}: PromotionsToolbarProps) {
  const sortValue = `${sort.id}:${sort.dir}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search name or coupon code…"
            className="h-9 pl-9"
            aria-label="Search promotions"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

          <Select value={filters.type} onValueChange={(v) => onFilterChange("type", v)}>
            <SelectTrigger size="sm" className="hidden h-9 w-[9rem] sm:flex">
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

          <Select value={filters.scope} onValueChange={(v) => onFilterChange("scope", v)}>
            <SelectTrigger size="sm" className="hidden h-9 w-[9.5rem] md:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCOPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.usage} onValueChange={(v) => onFilterChange("usage", v)}>
            <SelectTrigger size="sm" className="hidden h-9 w-[9.5rem] xl:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USAGE_OPTIONS.map((o) => (
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
              onValueChange={(v) => v && onViewChange(v as PromotionsViewMode)}
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
