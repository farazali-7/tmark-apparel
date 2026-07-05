"use client"

import { Eye, Package } from "lucide-react"

import { CampaignCover } from "@/components/shared/campaign-cover"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CollectionActions } from "@/features/collections/components/collection-actions"
import {
  COLLECTION_STATUS_META,
  formatNumber,
  formatRelative,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Collection } from "@/types"

interface CollectionCardProps {
  collection: Collection
  selected: boolean
  onSelectToggle: (id: string) => void
  onView: (collection: Collection) => void
  onDelete: (collection: Collection) => void
}

export function CollectionCard({
  collection,
  selected,
  onSelectToggle,
  onView,
  onDelete,
}: CollectionCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md",
        selected && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <CampaignCover
          seed={collection.cover}
          label={collection.season}
          className="size-full transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div
          className={cn(
            "absolute top-3 left-3 z-10 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelectToggle(collection.id)}
            className="border-white/70 bg-black/30 backdrop-blur data-[state=checked]:border-foreground"
            aria-label={`Select ${collection.name}`}
          />
        </div>

        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {collection.featured ? <StatusBadge label="Featured" tone="gold" /> : null}
          <StatusBadge
            label={COLLECTION_STATUS_META[collection.status].label}
            tone={COLLECTION_STATUS_META[collection.status].tone}
            className="bg-background/90 backdrop-blur"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
          <p className="text-[0.65rem] font-medium tracking-[0.14em] text-white/70 uppercase">
            {collection.season} Collection
          </p>
          <h3 className="font-display text-xl leading-tight font-medium">
            {collection.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/75">
            {collection.subtitle}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-2 justify-end gap-2 p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            className="backdrop-blur"
            onClick={() => onView(collection)}
          >
            <Eye className="size-4" /> Preview
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 p-3.5">
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          {collection.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {cat}
            </span>
          ))}
          {collection.categories.length > 2 ? (
            <span className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground">
              +{collection.categories.length - 2}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 tabular">
            <Package className="size-3.5" />
            {formatNumber(collection.productCount)}
          </span>
          <CollectionActions
            collection={collection}
            onView={onView}
            onDelete={onDelete}
          />
        </div>
      </div>

      <div className="border-t px-3.5 py-2 text-[0.7rem] text-muted-foreground">
        Updated {formatRelative(collection.updatedAt)}
      </div>
    </div>
  )
}
