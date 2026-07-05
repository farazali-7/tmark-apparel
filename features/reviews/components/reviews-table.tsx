"use client"

import { ImageIcon, MessageSquareReply, ThumbsUp } from "lucide-react"

import {
  DataTable,
  type Column,
  type SortState,
} from "@/components/shared/data-table"
import { EntityAvatar } from "@/components/shared/entity-avatar"
import { ProductThumb } from "@/components/shared/product-thumb"
import { StarRating } from "@/components/shared/star-rating"
import { ReviewActions } from "@/features/reviews/components/review-actions"
import {
  FeaturedBadge,
  PinnedBadge,
  ReviewStatusBadge,
} from "@/features/reviews/components/review-badges"
import { formatRelative } from "@/lib/constants"
import type { ReviewDetail } from "@/types"

interface ReviewsTableProps {
  data: ReviewDetail[]
  loading?: boolean
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  sort: SortState | null
  onSortChange: (id: string) => void
  onView: (review: ReviewDetail) => void
  onDelete: (review: ReviewDetail) => void
  empty?: React.ReactNode
}

export function ReviewsTable({
  data,
  loading,
  selectedIds,
  onSelectionChange,
  sort,
  onSortChange,
  onView,
  onDelete,
  empty,
}: ReviewsTableProps) {
  const columns: Column<ReviewDetail>[] = [
    {
      id: "customer",
      header: "Customer",
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <EntityAvatar initials={r.customer.initials} seed={r.customer.id} className="size-9" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{r.customer.name}</p>
            <p className="text-xs text-muted-foreground tabular">{r.reference}</p>
          </div>
        </div>
      ),
    },
    {
      id: "product",
      header: "Product",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <ProductThumb seed={r.product.image} name={r.product.name} className="size-9" iconClassName="size-4" />
          <span className="max-w-[10rem] truncate text-sm">{r.product.name}</span>
        </div>
      ),
    },
    {
      id: "rating",
      header: "Rating",
      sortable: true,
      cell: (r) => <StarRating rating={r.rating} />,
    },
    {
      id: "review",
      header: "Review",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
      cell: (r) => (
        <div className="max-w-[22rem]">
          <p className="truncate text-sm font-medium">{r.title}</p>
          <p className="truncate text-xs text-muted-foreground">{r.body}</p>
        </div>
      ),
    },
    {
      id: "media",
      header: "Media",
      align: "center",
      headerClassName: "hidden sm:table-cell",
      cellClassName: "hidden sm:table-cell",
      cell: (r) => (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          {r.photos.length > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs tabular">
              <ImageIcon className="size-3.5" />
              {r.photos.length}
            </span>
          ) : null}
          {r.reply ? (
            <MessageSquareReply className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : null}
          {r.photos.length === 0 && !r.reply ? (
            <span className="text-muted-foreground/40">—</span>
          ) : null}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (r) => (
        <div className="flex flex-col items-start gap-1">
          <ReviewStatusBadge status={r.status} />
          {r.pinned ? <PinnedBadge /> : r.featured ? <FeaturedBadge /> : null}
        </div>
      ),
    },
    {
      id: "helpfulCount",
      header: "Helpful",
      align: "right",
      sortable: true,
      headerClassName: "hidden 2xl:table-cell",
      cellClassName: "hidden 2xl:table-cell",
      cell: (r) => (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground tabular">
          <ThumbsUp className="size-3.5" />
          {r.helpfulCount}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: "Date",
      sortable: true,
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (r) => (
        <span className="text-sm text-muted-foreground">{formatRelative(r.createdAt)}</span>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      loading={loading}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      sort={sort}
      onSortChange={onSortChange}
      onRowClick={onView}
      stickyHeader
      skeletonRows={8}
      empty={empty}
      rowActions={(r) => (
        <ReviewActions review={r} onView={onView} onDelete={onDelete} />
      )}
    />
  )
}
