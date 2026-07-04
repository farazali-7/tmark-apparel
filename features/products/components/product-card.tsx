"use client"

import { Eye, Star } from "lucide-react"

import { ProductThumb } from "@/components/shared/product-thumb"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ProductActions } from "@/features/products/components/product-actions"
import { PRODUCT_STATUS_META, formatCurrency } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  selected: boolean
  onSelectToggle: (id: string) => void
  onView: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductCard({
  product,
  selected,
  onSelectToggle,
  onView,
  onDelete,
}: ProductCardProps) {
  const out = product.stock === 0
  const low = !out && product.stock <= product.lowStockThreshold

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md",
        selected && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
      )}
    >
      <div className="relative aspect-4/5 overflow-hidden">
        <ProductThumb
          seed={product.image}
          name={product.name}
          className="size-full rounded-none transition-transform duration-300 group-hover:scale-[1.03]"
          iconClassName="size-16"
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
            onCheckedChange={() => onSelectToggle(product.id)}
            className="border-white/70 bg-black/30 backdrop-blur data-[state=checked]:border-foreground"
            aria-label={`Select ${product.name}`}
          />
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {product.featured ? (
            <span className="flex size-6 items-center justify-center rounded-full bg-black/35 text-gold backdrop-blur">
              <Star className="size-3.5 fill-current" />
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-2.5 left-2.5">
          <StatusBadge
            label={PRODUCT_STATUS_META[product.status].label}
            tone={PRODUCT_STATUS_META[product.status].tone}
            className="bg-background/85 backdrop-blur"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-2 bg-gradient-to-t from-black/45 to-transparent p-2.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 backdrop-blur"
            onClick={() => onView(product)}
          >
            <Eye className="size-4" /> Quick view
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {product.category} · {product.collection}
            </p>
          </div>
          <ProductActions product={product} onView={onView} onDelete={onDelete} />
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.salePrice ? (
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tabular">
                  {formatCurrency(product.salePrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through tabular">
                  {formatCurrency(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-semibold tabular">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          <span
            className={cn(
              "text-xs font-medium tabular",
              out
                ? "text-rose-600 dark:text-rose-400"
                : low
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
            )}
          >
            {out ? "Out of stock" : `${product.stock} in stock`}
          </span>
        </div>
      </div>
    </div>
  )
}
