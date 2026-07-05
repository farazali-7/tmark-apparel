"use client"

import { CategoryCard } from "@/features/categories/components/category-card"
import type { Category } from "@/types"

interface CategoriesGridProps {
  data: Category[]
  selectedIds: string[]
  onSelectToggle: (id: string) => void
  onView: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoriesGrid({
  data,
  selectedIds,
  onSelectToggle,
  onView,
  onDelete,
}: CategoriesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {data.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          selected={selectedIds.includes(category.id)}
          onSelectToggle={onSelectToggle}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
