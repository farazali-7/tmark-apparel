"use client"

import { toast } from "sonner"
import {
  Archive,
  Copy,
  Eye,
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

interface CollectionActionsProps {
  collection: Collection
  onView: (collection: Collection) => void
  onDelete: (collection: Collection) => void
  triggerClassName?: string
}

export function CollectionActions({
  collection,
  onView,
  onDelete,
  triggerClassName,
}: CollectionActionsProps) {
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
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onSelect={() => onView(collection)}>
          <Eye /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success(`Editing ${collection.name}`)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`Duplicated ${collection.name}`)}
        >
          <Copy /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            toast.success(
              collection.featured ? "Removed from featured" : "Marked as featured"
            )
          }
        >
          <Star /> {collection.featured ? "Unfeature" : "Feature"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast(`Archived ${collection.name}`)}>
          <Archive /> Archive
        </DropdownMenuItem>
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
