"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ExternalLink, ImageIcon } from "lucide-react"

import { EntityAvatar } from "@/components/shared/entity-avatar"
import { ProductThumb } from "@/components/shared/product-thumb"
import { SectionHeader } from "@/components/shared/section-header"
import { StarRating } from "@/components/shared/star-rating"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReviewDetail } from "@/types"

interface PhotoItem {
  seed: string
  review: ReviewDetail
}

interface PhotoGalleryProps {
  reviews: ReviewDetail[]
  onOpenReview: (review: ReviewDetail) => void
  loading?: boolean
}

const VISIBLE = 12

export function PhotoGallery({
  reviews,
  onOpenReview,
  loading = false,
}: PhotoGalleryProps) {
  const photos = React.useMemo<PhotoItem[]>(
    () =>
      reviews.flatMap((review) =>
        review.photos.map((seed) => ({ seed, review }))
      ),
    [reviews]
  )

  const [index, setIndex] = React.useState<number | null>(null)
  const open = index !== null
  const current = index !== null ? photos[index] : null

  const go = React.useCallback(
    (dir: 1 | -1) =>
      setIndex((i) =>
        i === null ? i : (i + dir + photos.length) % photos.length
      ),
    [photos.length]
  )

  if (loading) {
    return (
      <section className="space-y-4">
        <SectionHeader title="Photo Reviews" description="Customer photography" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </section>
    )
  }

  if (photos.length === 0) return null

  const shown = photos.slice(0, VISIBLE)
  const remaining = photos.length - shown.length

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Photo Reviews"
        description={`${photos.length} customer photos across ${
          new Set(photos.map((p) => p.review.product.id)).size
        } products`}
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {shown.map((photo, i) => (
          <button
            key={`${photo.review.id}-${photo.seed}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label={`Photo by ${photo.review.customer.name} — ${photo.review.product.name}`}
          >
            <ProductThumb
              seed={photo.seed}
              name={photo.review.product.name}
              className="size-full rounded-none"
              iconClassName="size-6"
            />
            <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/0 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex items-center gap-1 text-[0.65rem] font-medium text-white">
                <StarRating rating={photo.review.rating} className="[&_svg]:size-2.5" />
              </span>
              <span className="truncate text-[0.65rem] text-white/80">
                {photo.review.customer.name}
              </span>
            </span>
            {i === VISIBLE - 1 && remaining > 0 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-medium backdrop-blur-sm">
                +{remaining}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0" showCloseButton>
          {current ? (
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square bg-muted md:aspect-auto">
                <ProductThumb
                  seed={current.seed}
                  name={current.review.product.name}
                  className="absolute inset-0 size-full rounded-none"
                  iconClassName="size-12"
                />
                {photos.length > 1 ? (
                  <>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => go(-1)}
                      aria-label="Previous photo"
                      className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/90"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => go(1)}
                      aria-label="Next photo"
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/90"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </>
                ) : null}
                <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[0.7rem] text-muted-foreground">
                  <ImageIcon className="size-3" />
                  {(index ?? 0) + 1} / {photos.length}
                </span>
              </div>

              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-center gap-2.5">
                  <EntityAvatar
                    initials={current.review.customer.initials}
                    seed={current.review.customer.id}
                    className="size-9"
                  />
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-sm font-medium">
                      {current.review.customer.name}
                    </DialogTitle>
                    <StarRating rating={current.review.rating} className="mt-0.5" />
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Reviewed</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {current.review.product.name}
                  </p>
                </div>
                <p className="line-clamp-5 text-sm text-muted-foreground">
                  “{current.review.body}”
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-auto"
                  onClick={() => {
                    const r = current.review
                    setIndex(null)
                    onOpenReview(r)
                  }}
                >
                  <ExternalLink className="size-4" /> View full review
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
