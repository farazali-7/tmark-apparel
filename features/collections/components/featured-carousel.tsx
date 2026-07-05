"use client"

import { CampaignCover } from "@/components/shared/campaign-cover"
import { HorizontalScroller } from "@/components/shared/horizontal-scroller"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatNumber } from "@/lib/constants"
import type { Collection } from "@/types"

interface FeaturedCarouselProps {
  collections: Collection[]
  onView: (collection: Collection) => void
}

export function FeaturedCarousel({ collections, onView }: FeaturedCarouselProps) {
  if (collections.length === 0) return null

  return (
    <section className="space-y-3">
      <SectionHeader
        title="Featured Campaigns"
        description="Collections currently spotlighted on the storefront"
      />
      <HorizontalScroller itemClassName="w-64 sm:w-72" ariaLabel="Featured collections">
        {collections.map((collection) => (
          <button
            key={collection.id}
            type="button"
            onClick={() => onView(collection)}
            className="group block w-full overflow-hidden rounded-xl border text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <div className="relative aspect-16/10 overflow-hidden">
              <CampaignCover
                seed={collection.cover}
                label={collection.season}
                className="size-full transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute top-2.5 right-2.5 z-10">
                <StatusBadge label="Featured" tone="gold" />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-white">
                <h3 className="font-display text-base leading-tight font-medium">
                  {collection.name}
                </h3>
                <p className="text-[0.7rem] text-white/75 tabular">
                  {formatNumber(collection.productCount)} products
                </p>
              </div>
            </div>
          </button>
        ))}
      </HorizontalScroller>
    </section>
  )
}
