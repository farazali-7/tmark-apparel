"use client"

import { toast } from "sonner"
import {
  Check,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pin,
  Reply,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { ReviewDetail } from "@/types"

interface ReviewActionsProps {
  review: ReviewDetail
  onView: (review: ReviewDetail) => void
  onDelete: (review: ReviewDetail) => void
  triggerClassName?: string
}

export function ReviewActions({
  review,
  onView,
  onDelete,
  triggerClassName,
}: ReviewActionsProps) {
  const canApprove = review.status !== "approved"
  const canReject = review.status !== "rejected"

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
          <span className="sr-only">Open actions for {review.reference}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={() => onView(review)}>
          <Eye /> View details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onView(review)}>
          <Reply /> Reply
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {canApprove ? (
          <DropdownMenuItem onSelect={() => toast.success(`${review.reference} approved`)}>
            <Check /> Approve
          </DropdownMenuItem>
        ) : null}
        {canReject ? (
          <DropdownMenuItem onSelect={() => toast(`${review.reference} rejected`)}>
            <X /> Reject
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onSelect={() =>
            toast.success(review.status === "hidden" ? "Review shown" : "Review hidden")
          }
        >
          <EyeOff /> {review.status === "hidden" ? "Unhide" : "Hide"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            toast.success(review.pinned ? "Review unpinned" : "Review pinned")
          }
        >
          <Pin /> {review.pinned ? "Unpin" : "Pin review"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            toast.success(review.featured ? "Removed from featured" : "Review featured")
          }
        >
          <Sparkles /> {review.featured ? "Unfeature" : "Feature"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(review)}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
