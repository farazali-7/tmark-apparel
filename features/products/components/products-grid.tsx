"use client"

import { ProductCard } from "@/features/products/components/product-card"
import type { Product } from "@/types"

interface ProductsGridProps {
  data: Product[]
  selectedIds: string[]
  onSelectToggle: (id: string) => void
  onView: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductsGrid({
  data,
  selectedIds,
  onSelectToggle,
  onView,
  onDelete,
}: ProductsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {data.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selected={selectedIds.includes(product.id)}
          onSelectToggle={onSelectToggle}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
