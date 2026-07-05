import type {
  CategoryStatus,
  CollectionStatus,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  ReviewStatus,
  Visibility,
} from "@/types"

export type StatusTone =
  | "neutral"
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "gold"

export interface StatusMeta {
  label: string
  tone: StatusTone
}

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "info" },
  tailoring: { label: "Tailoring", tone: "gold" },
  ready: { label: "Ready", tone: "info" },
  shipped: { label: "Shipped", tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
}

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusMeta> = {
  paid: { label: "Paid", tone: "success" },
  unpaid: { label: "Unpaid", tone: "warning" },
  refunded: { label: "Refunded", tone: "neutral" },
}

export const PRODUCT_STATUS_META: Record<ProductStatus, StatusMeta> = {
  active: { label: "Active", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
  archived: { label: "Archived", tone: "danger" },
}

export const REVIEW_STATUS_META: Record<ReviewStatus, StatusMeta> = {
  approved: { label: "Approved", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  rejected: { label: "Rejected", tone: "danger" },
}

export const CATEGORY_STATUS_META: Record<CategoryStatus, StatusMeta> = {
  active: { label: "Active", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
}

export const VISIBILITY_META: Record<Visibility, StatusMeta> = {
  visible: { label: "Visible", tone: "info" },
  hidden: { label: "Hidden", tone: "warning" },
}

export const COLLECTION_STATUS_META: Record<CollectionStatus, StatusMeta> = {
  published: { label: "Published", tone: "success" },
  scheduled: { label: "Scheduled", tone: "gold" },
  draft: { label: "Draft", tone: "neutral" },
  archived: { label: "Archived", tone: "danger" },
}

export const SEASONS = [
  "Wedding",
  "Festive",
  "Winter 2026",
  "Summer 2026",
  "Evergreen",
  "Limited Edition",
] as const

export const CATEGORIES = [
  "Sherwanis",
  "Waistcoats",
  "Prince Coats",
  "Western Suits",
  "Shalwar Kameez",
  "Kurtas",
] as const

export const COLLECTIONS = [
  "Wedding Collection",
  "Eid Collection",
  "Summer Collection",
  "Best Sellers",
  "New Arrivals",
] as const

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const

export const COLORS = [
  "Ivory",
  "Charcoal",
  "Navy",
  "Maroon",
  "Black",
  "Sand",
  "Emerald",
] as const

export const FABRICS = [
  "Wool Blend",
  "Raw Silk",
  "Velvet",
  "Egyptian Cotton",
  "Linen",
  "Jamawar",
] as const

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value).replace("PKR", "PKR ")
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(iso)
}
