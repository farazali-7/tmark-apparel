"use client"

import { Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface BannerFilters {
  status: string
  type: string
  sort: string
}

interface BannersToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  filters: BannerFilters
  onFilterChange: (key: keyof BannerFilters, value: string) => void
  onClear: () => void
  activeCount: number
}

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Draft" },
  { value: "expired", label: "Expired" },
  { value: "archived", label: "Archived" },
]

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "homepage", label: "Homepage" },
  { value: "category", label: "Category" },
  { value: "collection", label: "Collection" },
  { value: "popup", label: "Popup" },
  { value: "announcement", label: "Announcement" },
]

const SORT_OPTIONS = [
  { value: "recent", label: "Recently updated" },
  { value: "priority", label: "Priority" },
  { value: "startDate", label: "Start date" },
  { value: "impressions", label: "Most impressions" },
]

export function BannersToolbar({
  query,
  onQueryChange,
  filters,
  onFilterChange,
  onClear,
  activeCount,
}: BannersToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1 lg:max-w-xs">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search campaigns…"
          className="h-9 pl-9"
          aria-label="Search banners"
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

        <div className="ml-auto flex items-center gap-2">
          {activeCount > 0 ? (
            <Button
              variant="ghost"
              size="xs"
              onClick={onClear}
              className="text-xs text-muted-foreground"
            >
              <X className="size-3" /> Clear
            </Button>
          ) : null}
          <Select value={filters.sort} onValueChange={(v) => onFilterChange("sort", v)}>
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
        </div>
      </div>
    </div>
  )
}
