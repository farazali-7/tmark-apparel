"use client"

import { CornerDownRight, Eye, Layers, Package } from "lucide-react"

import { ProductThumb } from "@/components/shared/product-thumb"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CategoryActions } from "@/features/categories/components/category-actions"
import {
  CATEGORY_STATUS_META,
  VISIBILITY_META,
  formatNumber,
  formatRelative,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

interface CategoryCardProps {
  category: Category
  selected: boolean
  onSelectToggle: (id: string) => void
  onView: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryCard({
  category,
  selected,
  onSelectToggle,
  onView,
  onDelete,
}: CategoryCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md",
        selected && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
      )}
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <ProductThumb
          seed={category.image}
          name={category.name}
          className="size-full rounded-none transition-transform duration-300 group-hover:scale-[1.03]"
          iconClassName="size-12"
        />

        <div
          className={cn(
            "absolute top-2.5 left-2.5 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelectToggle(category.id)}
            className="border-white/70 bg-black/30 backdrop-blur data-[state=checked]:border-foreground"
            aria-label={`Select ${category.name}`}
          />
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {category.featured ? <StatusBadge label="Featured" tone="gold" /> : null}
          <StatusBadge
            label={VISIBILITY_META[category.visibility].label}
            tone={VISIBILITY_META[category.visibility].tone}
            className="bg-background/85 backdrop-blur"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-2 bg-gradient-to-t from-black/45 to-transparent p-2.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 backdrop-blur"
            onClick={() => onView(category)}
          >
            <Eye className="size-4" /> View details
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {category.parent ? (
                <CornerDownRight className="size-3 text-muted-foreground/60" />
              ) : null}
              <p className="truncate text-sm font-medium">{category.name}</p>
            </div>
            <p className="truncate text-xs text-muted-foreground tabular">
              /{category.slug}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <StatusBadge
              label={CATEGORY_STATUS_META[category.status].label}
              tone={CATEGORY_STATUS_META[category.status].tone}
            />
            <CategoryActions
              category={category}
              onView={onView}
              onDelete={onDelete}
            />
          </div>
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {category.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t pt-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1 tabular">
              <Package className="size-3.5" />
              {formatNumber(category.productCount)}
            </span>
            <span className="flex items-center gap-1 tabular">
              <Layers className="size-3.5" />
              {category.collections.length}
            </span>
          </span>
          <span>Updated {formatRelative(category.updatedAt)}</span>
        </div>
      </div>
    </div>
  )
}
