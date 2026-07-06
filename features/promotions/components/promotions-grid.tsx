"use client"

import { PromotionCard } from "@/features/promotions/components/promotion-card"
import type { Promotion } from "@/types"

interface PromotionsGridProps {
  data: Promotion[]
  selectedIds: string[]
  onSelectToggle: (id: string) => void
  onView: (promotion: Promotion) => void
  onDelete: (promotion: Promotion) => void
  onToggleStatus: (promotion: Promotion) => void
}

export function PromotionsGrid({
  data,
  selectedIds,
  onSelectToggle,
  onView,
  onDelete,
  onToggleStatus,
}: PromotionsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((promotion) => (
        <PromotionCard
          key={promotion.id}
          promotion={promotion}
          selected={selectedIds.includes(promotion.id)}
          onSelectToggle={onSelectToggle}
          onView={onView}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}
