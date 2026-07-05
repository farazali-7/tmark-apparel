"use client"

import * as React from "react"

import { ProductThumb } from "@/components/shared/product-thumb"
import { StarRating } from "@/components/shared/star-rating"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { RatingChip } from "@/features/reviews/components/review-badges"
import { formatNumber } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { ReviewDetail, ReviewProductRef } from "@/types"

interface ReputationOverviewProps {
  reviews: ReviewDetail[]
  activeRating: number | null
  onSelectRating: (rating: number | null) => void
  loading?: boolean
}

type ProductLens = "top" | "attention" | "most"

function dedupeProducts(reviews: ReviewDetail[]): ReviewProductRef[] {
  const map = new Map<string, ReviewProductRef>()
  for (const r of reviews) if (!map.has(r.product.id)) map.set(r.product.id, r.product)
  return [...map.values()]
}

export function ReputationOverview({
  reviews,
  activeRating,
  onSelectRating,
  loading = false,
}: ReputationOverviewProps) {
  const [lens, setLens] = React.useState<ProductLens>("top")

  const total = reviews.length
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0

  const distribution = React.useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length
      return { star, count, pct: total ? (count / total) * 100 : 0 }
    })
  }, [reviews, total])

  const products = React.useMemo(() => {
    const list = dedupeProducts(reviews)
    switch (lens) {
      case "attention":
        return [...list].sort((a, b) => a.rating - b.rating).slice(0, 5)
      case "most":
        return [...list].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5)
      default:
        return [...list].sort((a, b) => b.rating - a.rating).slice(0, 5)
    }
  }, [reviews, lens])

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-5">
        <Skeleton className="h-72 rounded-xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-xl lg:col-span-3" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Overall rating + distribution */}
      <section className="rounded-xl border bg-card p-5 lg:col-span-2">
        <h2 className="text-sm font-semibold tracking-tight">Overall Rating</h2>
        <div className="mt-4 flex items-end gap-4">
          <div className="flex flex-col">
            <span className="font-display text-5xl leading-none font-medium tabular">
              {avg.toFixed(1)}
            </span>
            <StarRating rating={Math.round(avg)} className="mt-2" />
          </div>
          <p className="pb-1 text-xs text-muted-foreground">
            Based on{" "}
            <span className="font-medium text-foreground">{formatNumber(total)}</span>{" "}
            reviews
          </p>
        </div>

        <div className="mt-5 space-y-1.5" role="group" aria-label="Filter by rating">
          {distribution.map(({ star, count, pct }) => {
            const isActive = activeRating === star
            return (
              <button
                key={star}
                type="button"
                onClick={() => onSelectRating(isActive ? null : star)}
                aria-pressed={isActive}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  isActive && "bg-accent"
                )}
              >
                <span className="flex w-7 shrink-0 items-center gap-0.5 text-xs font-medium tabular">
                  {star}
                  <span className="text-gold">★</span>
                </span>
                <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all",
                      star >= 4 ? "bg-gold/80" : star === 3 ? "bg-amber-500/70" : "bg-rose-500/60"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right text-xs text-muted-foreground tabular">
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Product leaderboard */}
      <section className="rounded-xl border bg-card p-5 lg:col-span-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-tight">Products</h2>
          <ToggleGroup
            type="single"
            value={lens}
            onValueChange={(v) => v && setLens(v as ProductLens)}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <ToggleGroupItem value="top" className="px-2.5 text-xs">
              Top rated
            </ToggleGroupItem>
            <ToggleGroupItem value="attention" className="px-2.5 text-xs">
              Needs attention
            </ToggleGroupItem>
            <ToggleGroupItem value="most" className="px-2.5 text-xs">
              Most reviewed
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <ul className="mt-4 divide-y">
          {products.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className="w-4 text-center text-xs text-muted-foreground tabular">
                {i + 1}
              </span>
              <ProductThumb seed={p.image} name={p.name} className="size-10" iconClassName="size-4" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.category} · {formatNumber(p.reviewsCount)} reviews
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <StarRating rating={Math.round(p.rating)} className="hidden sm:flex" />
                <RatingChip rating={p.rating} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
