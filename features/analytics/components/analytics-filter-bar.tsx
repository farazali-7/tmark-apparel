"use client"

import { CalendarRange, Check } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CATEGORIES } from "@/lib/constants"

export interface AnalyticsFilters {
  range: string
  country: string
  category: string
  orderType: string
  compare: boolean
}

export const DATE_RANGES = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "year", label: "This year" },
  { value: "custom", label: "Custom range" },
]

const COUNTRIES = ["Pakistan", "United Kingdom", "UAE", "Saudi Arabia", "United States", "Canada", "Qatar", "Australia"]

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilters
  onChange: (key: keyof AnalyticsFilters, value: string | boolean) => void
}

export function AnalyticsFilterBar({ filters, onChange }: AnalyticsFilterBarProps) {
  return (
    <div className="sticky top-2 z-20 rounded-xl border bg-card/95 p-2.5 shadow-sm backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={filters.range} onValueChange={(v) => onChange("range", v)}>
          <SelectTrigger size="sm" className="h-9 w-[9.5rem]">
            <CalendarRange className="size-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGES.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.country} onValueChange={(v) => onChange("country", v)}>
          <SelectTrigger size="sm" className="hidden h-9 w-[9rem] sm:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(v) => onChange("category", v)}>
          <SelectTrigger size="sm" className="hidden h-9 w-[9rem] md:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.orderType} onValueChange={(v) => onChange("orderType", v)}>
          <SelectTrigger size="sm" className="hidden h-9 w-[10rem] lg:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All order types</SelectItem>
            <SelectItem value="ready_to_wear">Ready to Wear</SelectItem>
            <SelectItem value="made_to_measure">Made to Measure</SelectItem>
            <SelectItem value="custom_tailoring">Custom Tailoring</SelectItem>
          </SelectContent>
        </Select>

        <label className="ml-auto flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium">
          <Switch
            checked={filters.compare}
            onCheckedChange={(v) => onChange("compare", v)}
            size="sm"
            aria-label="Compare previous period"
          />
          Compare previous
          {filters.compare ? <Check className="size-3 text-emerald-600 dark:text-emerald-400" /> : null}
        </label>
      </div>
    </div>
  )
}
