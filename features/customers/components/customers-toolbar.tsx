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

export interface CustomerFilters {
  vip: string
  country: string
  status: string
  relationship: string
}

export type CustomersViewMode = "list" | "grid"

interface CustomersToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  filters: CustomerFilters
  onFilterChange: (key: keyof CustomerFilters, value: string) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
  view: CustomersViewMode
  onViewChange: (view: CustomersViewMode) => void
  onClear: () => void
  activeCount: number
  countries: string[]
}

const SORT_OPTIONS: { value: string; label: string; sort: SortState }[] = [
  { value: "lifetimeValue:desc", label: "Top spenders", sort: { id: "lifetimeValue", dir: "desc" } },
  { value: "lastOrderAt:desc", label: "Recently ordered", sort: { id: "lastOrderAt", dir: "desc" } },
  { value: "joinedAt:desc", label: "Newest first", sort: { id: "joinedAt", dir: "desc" } },
  { value: "ordersCount:desc", label: "Most orders", sort: { id: "ordersCount", dir: "desc" } },
  { value: "name:asc", label: "Name: A to Z", sort: { id: "name", dir: "asc" } },
]

const VIP_OPTIONS = [
  { value: "all", label: "All tiers" },
  { value: "vip", label: "VIP only" },
  { value: "standard", label: "Standard" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
]

const RELATIONSHIP_OPTIONS = [
  { value: "all", label: "All customers" },
  { value: "tailoring", label: "Tailoring clients" },
  { value: "wedding", label: "Wedding clients" },
  { value: "measurements", label: "Has measurements" },
  { value: "international", label: "International" },
]

export function CustomersToolbar({
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
  countries,
}: CustomersToolbarProps) {
  const sortValue = `${sort.id}:${sort.dir}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search name, email, phone, ID…"
            className="h-9 pl-9"
            aria-label="Search customers"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.vip} onValueChange={(v) => onFilterChange("vip", v)}>
            <SelectTrigger size="sm" className="h-9 w-[8rem]">
              <SlidersHorizontal className="size-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIP_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.relationship}
            onValueChange={(v) => onFilterChange("relationship", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[10.5rem] sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIP_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange("status", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[8.5rem] md:flex">
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
            value={filters.country}
            onValueChange={(v) => onFilterChange("country", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[9rem] xl:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((c) => (
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
              onValueChange={(v) => v && onViewChange(v as CustomersViewMode)}
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
