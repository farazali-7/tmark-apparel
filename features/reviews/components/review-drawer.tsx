"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Check,
  Crown,
  ExternalLink,
  EyeOff,
  Flag,
  Pin,
  Sparkles,
  ThumbsUp,
  X,
} from "lucide-react"

import { EntityAvatar } from "@/components/shared/entity-avatar"
import { ProductThumb } from "@/components/shared/product-thumb"
import { StarRating } from "@/components/shared/star-rating"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from "@/lib/constants"
import type { ReviewDetail } from "@/types"
import {
  FeaturedBadge,
  FitBadge,
  InsightBadge,
  PinnedBadge,
  RatingChip,
  ReviewStatusBadge,
  VerifiedBadge,
} from "@/features/reviews/components/review-badges"
import { ReviewTimeline } from "@/features/reviews/components/review-timeline"

interface ReviewDrawerProps {
  review: ReviewDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (review: ReviewDetail) => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right font-medium">{value}</span>
    </div>
  )
}

export function ReviewDrawer({
  review,
  open,
  onOpenChange,
  onDelete,
}: ReviewDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-2xl"
      >
        {review ? (
          <ReviewDrawerBody
            key={review.id}
            review={review}
            onDelete={onDelete}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function ReviewDrawerBody({
  review,
  onDelete,
}: {
  review: ReviewDetail
  onDelete: (review: ReviewDetail) => void
}) {
  const [reply, setReply] = React.useState(review.reply?.message ?? "")

  return (
    <>
      <SheetHeader className="gap-0 border-b p-0">
        <div className="flex items-start gap-3 p-4 pr-14 sm:p-5 sm:pr-14">
          <EntityAvatar
            initials={review.customer.initials}
            seed={review.customer.id}
            className="size-11"
          />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <SheetTitle className="text-base font-medium">
                {review.customer.name}
              </SheetTitle>
              {review.customer.vip ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-muted/50 px-1.5 py-0.5 text-[0.65rem] font-medium text-[color-mix(in_oklch,var(--gold),black_25%)] dark:text-gold">
                  <Crown className="size-2.5" /> VIP
                </span>
              ) : null}
              {review.verifiedPurchase ? <VerifiedBadge /> : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={review.rating} />
              <ReviewStatusBadge status={review.status} />
              {review.pinned ? <PinnedBadge /> : null}
              {review.featured ? <FeaturedBadge /> : null}
            </div>
            <SheetDescription className="text-xs">
              {review.reference} · {formatDate(review.createdAt)}
            </SheetDescription>
          </div>
        </div>

        {/* Moderation quick actions */}
        <div className="flex flex-wrap items-center gap-2 px-4 pb-4 sm:px-5">
          {review.status !== "approved" ? (
            <Button size="sm" onClick={() => toast.success(`${review.reference} approved`)}>
              <Check className="size-4" /> Approve
            </Button>
          ) : null}
          {review.status !== "rejected" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast(`${review.reference} rejected`)}
            >
              <X className="size-4" /> Reject
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast.success(review.status === "hidden" ? "Review shown" : "Review hidden")
            }
          >
            <EyeOff className="size-4" /> {review.status === "hidden" ? "Unhide" : "Hide"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success(review.pinned ? "Unpinned" : "Pinned")}
          >
            <Pin className="size-4" /> {review.pinned ? "Unpin" : "Pin"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success(review.featured ? "Unfeatured" : "Featured")}
          >
            <Sparkles className="size-4" /> {review.featured ? "Unfeature" : "Feature"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive"
            onClick={() => onDelete(review)}
          >
            <Flag className="size-4" /> Delete
          </Button>
        </div>
      </SheetHeader>

      <Tabs defaultValue="review" className="gap-0">
        <div className="sticky top-0 z-10 border-b bg-popover px-4 pt-3 sm:px-5">
          <TabsList className="h-9 bg-transparent p-0">
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="reply">Reply</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Review content ───────────────────────────────────────── */}
        <TabsContent value="review" className="space-y-5 p-4 sm:p-5">
          <div>
            <h3 className="text-base font-medium">{review.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {review.body}
            </p>
          </div>

          {review.insights.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Extracted insights
              </p>
              <div className="flex flex-wrap gap-1.5">
                {review.insights.map((insight) => (
                  <InsightBadge
                    key={insight.label}
                    label={insight.label}
                    sentiment={insight.sentiment}
                    withIcon
                  />
                ))}
              </div>
            </div>
          ) : null}

          {review.photos.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Customer photos
              </p>
              <div className="flex flex-wrap gap-2">
                {review.photos.map((seed, i) => (
                  <ProductThumb
                    key={`${seed}-${i}`}
                    seed={seed}
                    name={`Photo ${i + 1}`}
                    className="size-20"
                    iconClassName="size-6"
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 tabular">
              <ThumbsUp className="size-4" /> {review.helpfulCount} found helpful
            </span>
            {review.fitFeedback ? <FitBadge fit={review.fitFeedback} /> : null}
            {review.reportedCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 tabular">
                <Flag className="size-4" /> {review.reportedCount} reports
              </span>
            ) : null}
          </div>

          <div className="rounded-xl border border-dashed bg-amber-500/5 p-3">
            <p className="mb-1.5 text-xs font-medium tracking-wide text-amber-700 uppercase dark:text-amber-400">
              Internal note
            </p>
            <Textarea
              defaultValue={review.internalNote ?? ""}
              placeholder="Add a private note for the team…"
              className="min-h-14 border-0 bg-transparent p-0 focus-visible:ring-0"
              onBlur={() => toast.success("Note saved")}
            />
          </div>
        </TabsContent>

        {/* ── Customer ─────────────────────────────────────────────── */}
        <TabsContent value="customer" className="space-y-4 p-4 sm:p-5">
          <div className="rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <EntityAvatar
                initials={review.customer.initials}
                seed={review.customer.id}
                className="size-11"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-medium">{review.customer.name}</p>
                  {review.customer.vip ? (
                    <Crown className="size-3.5 text-gold" aria-label="VIP" />
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  {review.verifiedPurchase ? "Verified purchaser" : "Unverified"}
                </p>
              </div>
              <Button variant="outline" size="xs">
                <ExternalLink className="size-3" /> Profile
              </Button>
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="font-display text-lg font-medium tabular">
                  {review.customer.ordersCount}
                </p>
                <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
                  Orders
                </p>
              </div>
              <div>
                <p className="font-display text-lg font-medium tabular">
                  {formatCompactCurrency(review.customer.lifetimeValue)}
                </p>
                <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
                  Lifetime
                </p>
              </div>
              <div>
                <p className="font-display text-lg font-medium tabular">
                  {review.customer.vip ? "VIP" : "—"}
                </p>
                <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
                  Tier
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Product ──────────────────────────────────────────────── */}
        <TabsContent value="product" className="space-y-4 p-4 sm:p-5">
          <div className="rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <ProductThumb
                seed={review.product.image}
                name={review.product.name}
                className="size-14"
                iconClassName="size-6"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{review.product.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StarRating rating={Math.round(review.product.rating)} />
                  <RatingChip rating={review.product.rating} />
                  <span className="text-xs text-muted-foreground">
                    ({review.product.reviewsCount})
                  </span>
                </div>
              </div>
              <Button variant="outline" size="xs">
                <ExternalLink className="size-3" /> Open
              </Button>
            </div>
            <Separator className="my-3" />
            <div className="divide-y">
              <Row label="Category" value={review.product.category} />
              <Row label="Collection" value={review.product.collection} />
              <Row label="Price" value={formatCurrency(review.product.price)} />
            </div>
          </div>
        </TabsContent>

        {/* ── Reply ────────────────────────────────────────────────── */}
        <TabsContent value="reply" className="space-y-4 p-4 sm:p-5">
          {review.reply ? (
            <div className="rounded-xl border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">{review.reply.author}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.reply.at)}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {review.reply.message}
              </p>
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {review.reply ? "Edit public reply" : "Write a public reply"}
            </p>
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={`Respond to ${review.customer.name} publicly…`}
              className="min-h-28"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Replies are shown publicly on the product page.
              </p>
              <Button
                size="sm"
                disabled={!reply.trim()}
                onClick={() => toast.success("Reply published")}
              >
                {review.reply ? "Update reply" : "Publish reply"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ── Activity ─────────────────────────────────────────────── */}
        <TabsContent value="activity" className="p-4 sm:p-5">
          <ReviewTimeline activity={review.activity} />
        </TabsContent>
      </Tabs>
    </>
  )
}
