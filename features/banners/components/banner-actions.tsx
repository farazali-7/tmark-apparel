"use client"

import { toast } from "sonner"
import {
  Archive,
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
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
import { cn } from "@/lib/utils"
import type { Banner } from "@/types"

interface BannerActionsProps {
  banner: Banner
  onEdit: (banner: Banner) => void
  onDelete: (banner: Banner) => void
  onArchive: (banner: Banner) => void
  triggerClassName?: string
}

export function BannerActions({
  banner,
  onEdit,
  onDelete,
  onArchive,
  triggerClassName,
}: BannerActionsProps) {
  const canPublish = banner.status === "draft" || banner.status === "scheduled"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon-sm"
          className={cn("backdrop-blur data-[state=open]:bg-muted", triggerClassName)}
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open actions for {banner.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onSelect={() => onEdit(banner)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success("Opened storefront preview")}>
          <Eye /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success(`Duplicated ${banner.name}`)}>
          <Copy /> Duplicate
        </DropdownMenuItem>
        {canPublish ? (
          <DropdownMenuItem onSelect={() => toast.success(`${banner.name} published`)}>
            <Power /> Publish now
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onSelect={() => onArchive(banner)}>
          <Archive /> Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(banner)}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
