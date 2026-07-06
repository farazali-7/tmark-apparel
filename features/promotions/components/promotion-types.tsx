"use client"

import { Plus, type LucideIcon } from "lucide-react"

import { HorizontalScroller } from "@/components/shared/horizontal-scroller"
import { SectionHeader } from "@/components/shared/section-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PROMOTION_SCOPE_META,
  PROMOTION_TYPE_META,
  formatNumber,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Promotion, PromotionScope, PromotionType } from "@/types"

/** A launchpad tile is a quick filter and a quick-create entry point. */
export interface TypeTile {
  key: string
  label: string
  icon: LucideIcon
  type?: PromotionType
  scope?: PromotionScope
  match: (p: Promotion) => boolean
}

export const TYPE_TILES: TypeTile[] = [
  { key: "percentage", label: PROMOTION_TYPE_META.percentage.label, icon: PROMOTION_TYPE_META.percentage.icon, type: "percentage", match: (p) => p.type === "percentage" },
  { key: "fixed", label: PROMOTION_TYPE_META.fixed.label, icon: PROMOTION_TYPE_META.fixed.icon, type: "fixed", match: (p) => p.type === "fixed" },
  { key: "free_shipping", label: PROMOTION_TYPE_META.free_shipping.label, icon: PROMOTION_TYPE_META.free_shipping.icon, type: "free_shipping", match: (p) => p.type === "free_shipping" },
  { key: "buy_x_get_y", label: PROMOTION_TYPE_META.buy_x_get_y.label, icon: PROMOTION_TYPE_META.buy_x_get_y.icon, type: "buy_x_get_y", match: (p) => p.type === "buy_x_get_y" },
  { key: "bundle", label: PROMOTION_TYPE_META.bundle.label, icon: PROMOTION_TYPE_META.bundle.icon, type: "bundle", match: (p) => p.type === "bundle" },
  { key: "collection", label: "Collection Discount", icon: PROMOTION_SCOPE_META.collection.icon, scope: "collection", match: (p) => p.scope === "collection" },
  { key: "category", label: "Category Discount", icon: PROMOTION_SCOPE_META.category.icon, scope: "category", match: (p) => p.scope === "category" },
  { key: "vip", label: "VIP Promotion", icon: PROMOTION_SCOPE_META.vip.icon, scope: "vip", match: (p) => p.scope === "vip" },
]

interface PromotionTypesProps {
  promotions: Promotion[]
  activeKey: string | null
  onSelect: (tile: TypeTile) => void
  onCreate: (tile: TypeTile) => void
  loading?: boolean
}

export function PromotionTypes({
  promotions,
  activeKey,
  onSelect,
  onCreate,
  loading = false,
}: PromotionTypesProps) {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Promotion Types"
        description="Your discount toolkit — click to filter, or spin up a new campaign"
      />
      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[6.5rem] w-44 shrink-0 rounded-xl" />
          ))}
        </div>
      ) : (
        <HorizontalScroller ariaLabel="Promotion types" itemClassName="w-44">
          {TYPE_TILES.map((tile) => {
            const count = promotions.filter(tile.match).length
            const active = tile.key === activeKey
            const activeCount = promotions.filter(
              (p) => tile.match(p) && p.status === "active"
            ).length
            const Icon = tile.icon
            return (
              <div
                key={tile.key}
                className={cn(
                  "group relative flex h-full flex-col justify-between rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  active && "ring-2 ring-gold/50"
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(tile)}
                  aria-pressed={active}
                  className="flex items-start justify-between gap-2 text-left focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background",
                      active && "bg-foreground text-background"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="font-display text-2xl leading-none font-medium tabular">
                    {formatNumber(count)}
                  </span>
                </button>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{tile.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {activeCount} active
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCreate(tile)}
                    aria-label={`Create ${tile.label}`}
                    className="flex size-6 shrink-0 items-center justify-center rounded-md border text-muted-foreground opacity-0 transition-all hover:border-foreground/30 hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </HorizontalScroller>
      )}
    </section>
  )
}
