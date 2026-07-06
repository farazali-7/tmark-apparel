"use client"

import { toast } from "sonner"
import {
  Copy,
  Eye,
  Pause,
  Pencil,
  Play,
  Power,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Promotion } from "@/types"

interface PromotionActionsProps {
  promotion: Promotion
  onView: (promotion: Promotion) => void
  onDelete: (promotion: Promotion) => void
  onToggleStatus: (promotion: Promotion) => void
  triggerClassName?: string
}

export function PromotionActions({
  promotion,
  onView,
  onDelete,
  onToggleStatus,
  triggerClassName,
}: PromotionActionsProps) {
  const isActive = promotion.status === "active"
  const canActivate =
    promotion.status === "paused" ||
    promotion.status === "draft" ||
    promotion.status === "scheduled"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "text-muted-foreground data-[state=open]:bg-muted",
            triggerClassName
          )}
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open actions for {promotion.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={() => onView(promotion)}>
          <Eye /> View details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success(`Editing ${promotion.code}`)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            navigator.clipboard?.writeText(promotion.code).catch(() => {})
            toast.success(`Copied ${promotion.code}`)
          }}
        >
          <Copy /> Copy code
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success(`Duplicated ${promotion.code}`)}>
          <Copy /> Duplicate
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isActive ? (
          <DropdownMenuItem onSelect={() => onToggleStatus(promotion)}>
            <Pause /> Pause
          </DropdownMenuItem>
        ) : canActivate ? (
          <DropdownMenuItem onSelect={() => onToggleStatus(promotion)}>
            <Play /> Activate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled>
            <Power /> Expired
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(promotion)}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
