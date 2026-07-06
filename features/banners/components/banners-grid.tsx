"use client"

import { BannerCard } from "@/features/banners/components/banner-card"
import type { Banner } from "@/types"

interface BannersGridProps {
  data: Banner[]
  selectedIds: string[]
  onSelectToggle: (id: string) => void
  onEdit: (banner: Banner) => void
  onDelete: (banner: Banner) => void
  onArchive: (banner: Banner) => void
}

export function BannersGrid({
  data,
  selectedIds,
  onSelectToggle,
  onEdit,
  onDelete,
  onArchive,
}: BannersGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {data.map((banner) => (
        <BannerCard
          key={banner.id}
          banner={banner}
          selected={selectedIds.includes(banner.id)}
          onSelectToggle={onSelectToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      ))}
    </div>
  )
}
