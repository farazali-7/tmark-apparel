"use client"

import { toast } from "sonner"
import {
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
import type { Category } from "@/types"

interface CategoryActionsProps {
  category: Category
  onView: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryActions({
  category,
  onView,
  onDelete,
}: CategoryActionsProps) {
  const hidden = category.visibility === "hidden"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open actions for {category.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onSelect={() => onView(category)}>
          <Eye /> View details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success(`Editing ${category.name}`)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`Duplicated ${category.name}`)}
        >
          <Copy /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            toast.success(
              category.featured ? "Removed from featured" : "Marked as featured"
            )
          }
        >
          <Star /> {category.featured ? "Unfeature" : "Feature"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            toast.success(hidden ? "Category is now visible" : "Category hidden")
          }
        >
          {hidden ? <Eye /> : <EyeOff />}
          {hidden ? "Show" : "Hide"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(category)}
        >
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
