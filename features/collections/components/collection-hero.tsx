"use client"

import { toast } from "sonner"
import { ArrowUpRight, Eye, Layers, Package, TrendingUp } from "lucide-react"

import { CampaignCover } from "@/components/shared/campaign-cover"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  COLLECTION_STATUS_META,
  formatCurrency,
  formatNumber,
} from "@/lib/constants"
import type { Collection } from "@/types"

interface CollectionHeroProps {
  collection: Collection
  onView: (collection: Collection) => void
}

export function CollectionHero({ collection, onView }: CollectionHeroProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border">
      <CampaignCover
        seed={collection.cover}
        className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <div className="relative flex min-h-[19rem] flex-col justify-between gap-6 p-6 text-white sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white uppercase backdrop-blur">
              {collection.season}
            </span>
            <StatusBadge
              label={COLLECTION_STATUS_META[collection.status].label}
              tone={COLLECTION_STATUS_META[collection.status].tone}
              className="bg-white/90 backdrop-blur"
            />
          </div>
          <span className="rounded-full bg-black/25 px-2.5 py-1 text-[0.65rem] font-medium tracking-[0.14em] text-white/80 uppercase backdrop-blur">
            Featured Campaign
          </span>
        </div>

        <div className="max-w-2xl space-y-3">
          <h2 className="font-display text-3xl leading-[1.05] font-medium sm:text-[2.6rem]">
            {collection.name}
          </h2>
          <p className="text-sm text-white/80 sm:text-base">
            {collection.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-white/85">
            <span className="flex items-center gap-1.5">
              <Package className="size-4" />
              {formatNumber(collection.productCount)} products
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="size-4" />
              {collection.categories.length} categories
            </span>
            {collection.revenue > 0 ? (
              <span className="flex items-center gap-1.5">
                <TrendingUp className="size-4" />
                {formatCurrency(collection.revenue)} earned
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onView(collection)}
              className="backdrop-blur"
            >
              <Eye className="size-4" /> Preview collection
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success(`Editing ${collection.name}`)}
              className="bg-white text-black hover:bg-white/90"
            >
              Edit campaign <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
