"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, GripVertical, Plus, Search, Star, X } from "lucide-react"

import { ProductThumb } from "@/components/shared/product-thumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/constants"
import { cn } from "@/lib/utils"

export interface PickerProduct {
  id: string
  name: string
  category: string
  image: string
  price: number
  salePrice?: number
}

interface ProductPickerProps {
  products: PickerProduct[]
  value: string[]
  onChange: (ids: string[]) => void
  className?: string
}

export function ProductPicker({
  products,
  value,
  onChange,
  className,
}: ProductPickerProps) {
  const [query, setQuery] = React.useState("")

  const byId = React.useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  )

  const available = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        !value.includes(p.id) &&
        (q === "" ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q))
    )
  }, [products, value, query])

  function add(id: string) {
    onChange([...value, id])
  }
  function remove(id: string) {
    onChange(value.filter((x) => x !== id))
  }
  function move(index: number, dir: -1 | 1) {
    const next = [...value]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className={cn("grid gap-3 lg:grid-cols-2", className)}>
      {/* Available */}
      <div className="flex flex-col rounded-lg border">
        <div className="relative border-b p-2">
          <Search className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="h-8 pl-8 text-sm"
          />
        </div>
        <ul className="max-h-56 overflow-y-auto p-1">
          {available.length === 0 ? (
            <li className="px-2 py-6 text-center text-xs text-muted-foreground">
              No products found
            </li>
          ) : (
            available.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => add(p.id)}
                  className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-muted"
                >
                  <ProductThumb seed={p.image} name={p.name} className="size-8" iconClassName="size-4" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.category}
                    </p>
                  </div>
                  <Plus className="size-4 text-muted-foreground" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Selected + reorder */}
      <div className="flex flex-col rounded-lg border">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-xs font-medium">
            {value.length} selected
          </span>
          <span className="text-[0.7rem] text-muted-foreground">
            First = featured
          </span>
        </div>
        <ul className="max-h-56 min-h-24 overflow-y-auto p-1">
          {value.length === 0 ? (
            <li className="px-2 py-8 text-center text-xs text-muted-foreground">
              Add products to build this collection
            </li>
          ) : (
            value.map((id, i) => {
              const p = byId.get(id)
              if (!p) return null
              return (
                <li
                  key={id}
                  className="flex items-center gap-1.5 rounded-md p-1.5 hover:bg-muted/60"
                >
                  <GripVertical className="size-3.5 shrink-0 text-muted-foreground/50" />
                  <ProductThumb seed={p.image} name={p.name} className="size-8" iconClassName="size-4" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 truncate text-sm font-medium">
                      {i === 0 ? (
                        <Star className="size-3 shrink-0 fill-gold text-gold" />
                      ) : null}
                      {p.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground tabular">
                      {formatCurrency(p.salePrice ?? p.price)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => move(i, 1)}
                      disabled={i === value.length - 1}
                      aria-label="Move down"
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => remove(id)}
                      aria-label="Remove"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}
