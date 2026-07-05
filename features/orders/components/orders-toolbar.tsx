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

export interface OrderFilters {
  type: string
  payment: string
  scope: string
  country: string
}

export type OrdersViewMode = "list" | "grid"

interface OrdersToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  filters: OrderFilters
  onFilterChange: (key: keyof OrderFilters, value: string) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
  view: OrdersViewMode
  onViewChange: (view: OrdersViewMode) => void
  onClear: () => void
  activeCount: number
  countries: string[]
}

const SORT_OPTIONS: { value: string; label: string; sort: SortState }[] = [
  { value: "createdAt:desc", label: "Newest first", sort: { id: "createdAt", dir: "desc" } },
  { value: "createdAt:asc", label: "Oldest first", sort: { id: "createdAt", dir: "asc" } },
  { value: "total:desc", label: "Amount: high to low", sort: { id: "total", dir: "desc" } },
  { value: "priority:desc", label: "Priority", sort: { id: "priority", dir: "desc" } },
  { value: "deadline:asc", label: "Deadline: soonest", sort: { id: "deadline", dir: "asc" } },
]

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "ready_to_wear", label: "Ready to Wear" },
  { value: "made_to_measure", label: "Made to Measure" },
  { value: "custom_tailoring", label: "Custom Tailoring" },
]

const PAYMENT_OPTIONS = [
  { value: "all", label: "All payments" },
  { value: "paid", label: "Paid" },
  { value: "partially_paid", label: "Partially Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "refund_requested", label: "Refund Requested" },
  { value: "refunded", label: "Refunded" },
]

const SCOPE_OPTIONS = [
  { value: "all", label: "All shipping" },
  { value: "domestic", label: "Domestic" },
  { value: "international", label: "International" },
]

export function OrdersToolbar({
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
}: OrdersToolbarProps) {
  const sortValue = `${sort.id}:${sort.dir}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search order #, customer, phone, email…"
            className="h-9 pl-9"
            aria-label="Search orders"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.type} onValueChange={(v) => onFilterChange("type", v)}>
            <SelectTrigger size="sm" className="h-9 w-[9.5rem]">
              <SlidersHorizontal className="size-3.5 text-muted-foreground" />
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
            value={filters.payment}
            onValueChange={(v) => onFilterChange("payment", v)}
          >
            <SelectTrigger size="sm" className="hidden h-9 w-[9.5rem] sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.scope} onValueChange={(v) => onFilterChange("scope", v)}>
            <SelectTrigger size="sm" className="hidden h-9 w-[8.5rem] md:flex">
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
              <SelectTrigger size="sm" className="h-9 w-[11.5rem]">
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
              onValueChange={(v) => v && onViewChange(v as OrdersViewMode)}
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
