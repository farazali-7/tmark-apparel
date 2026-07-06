"use client"

import { CircleDollarSign } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { PromotionActions } from "@/features/promotions/components/promotion-actions"
import {
  CountdownBadge,
  CouponCode,
  DiscountBadge,
  PromotionStatusBadge,
  ScopeBadge,
} from "@/features/promotions/components/promotion-badges"
import { UsageProgress } from "@/features/promotions/components/usage-progress"
import { formatCompactCurrency } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Promotion } from "@/types"

interface PromotionCardProps {
  promotion: Promotion
  selected: boolean
  onSelectToggle: (id: string) => void
  onView: (promotion: Promotion) => void
  onDelete: (promotion: Promotion) => void
  onToggleStatus: (promotion: Promotion) => void
}

export function PromotionCard({
  promotion,
  selected,
  onSelectToggle,
  onView,
  onDelete,
  onToggleStatus,
}: PromotionCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onView(promotion)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onView(promotion)
        }
      }}
      data-state={selected ? "selected" : undefined}
      className={cn(
        "group relative gap-0 overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected && "ring-2 ring-gold/50"
      )}
    >
      {promotion.featured ? (
        <span className="absolute inset-x-0 top-0 z-10 h-0.5 bg-gold/70" />
      ) : null}

      {/* Header band */}
      <div className="flex items-start justify-between gap-2 p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selected}
              onCheckedChange={() => onSelectToggle(promotion.id)}
              aria-label={`Select ${promotion.code}`}
              className={cn(
                "transition-opacity",
                !selected && "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              )}
            />
          </div>
          <DiscountBadge promotion={promotion} className="text-sm" />
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <PromotionStatusBadge status={promotion.status} />
          <PromotionActions
            promotion={promotion}
            onView={onView}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{promotion.name}</p>
          <ScopeBadge scope={promotion.scope} label={promotion.scopeLabel} className="mt-0.5" />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <CouponCode code={promotion.code} />
        </div>

        <UsageProgress used={promotion.usedCount} cap={promotion.maxUses} />

        <Separator />

        <div className="flex items-center justify-between gap-2">
          <CountdownBadge
            startDate={promotion.startDate}
            endDate={promotion.endDate}
            status={promotion.status}
          />
          <span className="inline-flex items-center gap-1 text-xs font-medium tabular">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            {promotion.revenue > 0 ? formatCompactCurrency(promotion.revenue) : "—"}
          </span>
        </div>
      </div>
    </Card>
  )
}
