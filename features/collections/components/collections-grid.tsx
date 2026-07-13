"use client"

import { CollectionCard } from "@/features/collections/components/collection-card"
import type { CollectionAction } from "@/features/collections/components/collection-actions"
import type { Collection } from "@/types"

interface CollectionsGridProps {
  data: Collection[]
  selectedIds: string[]
  onSelectToggle: (id: string) => void
  onView: (collection: Collection) => void
  onDelete: (collection: Collection) => void
  onAction: (action: CollectionAction, collection: Collection) => void
}

export function CollectionsGrid({
  data,
  selectedIds,
  onSelectToggle,
  onView,
  onDelete,
  onAction,
}: CollectionsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          selected={selectedIds.includes(collection.id)}
          onSelectToggle={onSelectToggle}
          onView={onView}
          onDelete={onDelete}
          onAction={onAction}
        />
      ))}
    </div>
  )
}
