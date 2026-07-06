"use client"

import { ArrowUpRight, MousePointerClick, Eye as EyeIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { BannerActions } from "@/features/banners/components/banner-actions"
import {
  BannerPriorityBadge,
  BannerStatusBadge,
  BannerTypeBadge,
} from "@/features/banners/components/banner-badges"
import { BannerPreview } from "@/features/banners/components/banner-preview"
import { formatDate, formatNumber } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Banner } from "@/types"

interface BannerCardProps {
  banner: Banner
  selected: boolean
  onSelectToggle: (id: string) => void
  onEdit: (banner: Banner) => void
  onDelete: (banner: Banner) => void
  onArchive: (banner: Banner) => void
}

function ctr(banner: Banner): string {
  if (!banner.impressions) return "—"
  return `${((banner.clicks / banner.impressions) * 100).toFixed(1)}%`
}

export function BannerCard({
  banner,
  selected,
  onSelectToggle,
  onEdit,
  onDelete,
  onArchive,
}: BannerCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        selected && "ring-2 ring-gold/50"
      )}
    >
      {/* Cover / live preview */}
      <button
        type="button"
        onClick={() => onEdit(banner)}
        className="relative block aspect-[16/7] w-full text-left focus-visible:outline-none"
        aria-label={`Edit ${banner.name}`}
      >
        <BannerPreview
          cover={banner.cover}
          headline={banner.headline}
          subtitle={banner.subtitle}
          cta={banner.cta}
          compact
          className="size-full transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute top-3 left-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelectToggle(banner.id)}
            aria-label={`Select ${banner.name}`}
            className={cn(
              "border-white/70 bg-black/20 backdrop-blur data-[state=checked]:border-gold",
              !selected && "opacity-0 transition-opacity group-hover:opacity-100"
            )}
          />
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1.5">
          <BannerStatusBadge status={banner.status} className="bg-background/90 backdrop-blur" />
        </span>
      </button>

      {/* Meta */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{banner.name}</p>
            <p className="truncate text-xs text-muted-foreground">{banner.subtitle}</p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <BannerActions banner={banner} onEdit={onEdit} onDelete={onDelete} onArchive={onArchive} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <BannerTypeBadge type={banner.type} />
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowUpRight className="size-3" />
            {banner.targetPage}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <span className="tabular">
            {formatDate(banner.startDate)}
            {banner.endDate ? ` — ${formatDate(banner.endDate)}` : " · No end"}
          </span>
          <BannerPriorityBadge priority={banner.priority} />
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 tabular">
            <EyeIcon className="size-3.5" /> {formatNumber(banner.impressions)}
          </span>
          <span className="inline-flex items-center gap-1 tabular">
            <MousePointerClick className="size-3.5" /> {formatNumber(banner.clicks)}
          </span>
          <span className="ml-auto tabular">CTR {ctr(banner)}</span>
        </div>
      </div>
    </div>
  )
}
