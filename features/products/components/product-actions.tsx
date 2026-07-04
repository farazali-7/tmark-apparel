"use client"

import { toast } from "sonner"
import {
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Sparkles,
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
import type { Product } from "@/types"

interface ProductActionsProps {
  product: Product
  onView: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductActions({
  product,
  onView,
  onDelete,
}: ProductActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open actions for {product.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onSelect={() => onView(product)}>
          <Eye /> View details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success(`Editing ${product.name}`)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`Duplicated ${product.name}`)}
        >
          <Copy /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            toast.success(
              product.featured ? "Removed from featured" : "Marked as featured"
            )
          }
        >
          <Star /> {product.featured ? "Unfeature" : "Feature"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast(`Archived ${product.name}`)}>
          <Sparkles /> Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(product)}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
