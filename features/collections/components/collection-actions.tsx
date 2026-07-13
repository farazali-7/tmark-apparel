"use client"

import { toast } from "sonner"
import {
  Archive,
  ArchiveRestore,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Star,
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
import type { Collection } from "@/types"

/** Row-level mutations the view owns; the menu only reports intent. */
export type CollectionAction =
  | "feature"
  | "duplicate"
  | "toggle-visibility"
  | "archive"
  | "restore"

interface CollectionActionsProps {
  collection: Collection
  onView: (collection: Collection) => void
  onDelete: (collection: Collection) => void
  onAction: (action: CollectionAction, collection: Collection) => void
  triggerClassName?: string
}

export function CollectionActions({
  collection,
  onView,
  onDelete,
  onAction,
  triggerClassName,
}: CollectionActionsProps) {
  const archived = collection.status === "archived"
  const visible = collection.visibility === "visible"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn("text-muted-foreground data-[state=open]:bg-muted", triggerClassName)}
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open actions for {collection.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => onView(collection)}>
          <Eye /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success(`Editing ${collection.name}`)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAction("duplicate", collection)}>
          <Copy /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onAction("feature", collection)}>
          <Star /> {collection.featured ? "Remove from featured" : "Mark as featured"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAction("toggle-visibility", collection)}>
          {visible ? (
            <>
              <EyeOff /> Hide from storefront
            </>
          ) : (
            <>
              <Eye /> Show on storefront
            </>
          )}
        </DropdownMenuItem>
        {archived ? (
          <DropdownMenuItem onSelect={() => onAction("restore", collection)}>
            <ArchiveRestore /> Restore to draft
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => onAction("archive", collection)}>
            <Archive /> Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(collection)}
        >
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
