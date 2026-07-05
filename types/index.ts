/**
 * Domain models for the T-Mark Apparel admin.
 * UI-only: these mirror the shapes the API will eventually return.
 */

export type ProductStatus = "active" | "draft" | "archived"

export type StockState = "in_stock" | "low_stock" | "out_of_stock"

export interface ProductVariant {
  id: string
  size: string
  color: string
  stock: number
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  image: string
  category: string
  collection: string
  price: number
  salePrice?: number
  costPrice?: number
  stock: number
  lowStockThreshold: number
  status: ProductStatus
  featured: boolean
  fabric: string
  sizes: string[]
  colors: string[]
  variants: ProductVariant[]
  shortDescription: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "tailoring"
  | "ready"
  | "shipped"
  | "delivered"
  | "cancelled"

export type PaymentStatus = "paid" | "unpaid" | "refunded"

export interface Order {
  id: string
  reference: string
  customerName: string
  customerInitials: string
  phone: string
  amount: number
  itemCount: number
  payment: PaymentStatus
  status: OrderStatus
  isCustom: boolean
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  initials: string
  orders: number
  totalSpent: number
  location: string
  joinedAt: string
}

export type ReviewStatus = "approved" | "pending" | "rejected"

export interface Review {
  id: string
  customerName: string
  customerInitials: string
  product: string
  rating: number
  comment: string
  status: ReviewStatus
  createdAt: string
}

export interface Delivery {
  id: string
  reference: string
  customerName: string
  status: OrderStatus
  eta: string
  courier: string
}

export type ActivityType =
  | "order"
  | "product"
  | "customer"
  | "review"
  | "refund"
  | "inventory"

export interface ActivityEvent {
  id: string
  type: ActivityType
  title: string
  meta: string
  timestamp: string
}

export type CategoryStatus = "active" | "draft"

export type Visibility = "visible" | "hidden"

export interface CategoryActivity {
  id: string
  label: string
  timestamp: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parent: string | null
  productCount: number
  collections: string[]
  visibility: Visibility
  status: CategoryStatus
  featured: boolean
  displayOrder: number
  metaTitle: string
  metaDescription: string
  createdAt: string
  updatedAt: string
  activity: CategoryActivity[]
}

export type CollectionStatus = "published" | "scheduled" | "draft" | "archived"

export interface Collection {
  id: string
  name: string
  subtitle: string
  slug: string
  description: string
  cover: string
  season: string
  status: CollectionStatus
  visibility: Visibility
  featured: boolean
  productCount: number
  categories: string[]
  scheduledFor: string | null
  revenue: number
  views: number
  conversion: number
  createdAt: string
  updatedAt: string
  activity: CategoryActivity[]
}

/* ────────────────────────────────────────────────────────────────────────
 * Orders — the operational model.
 *
 * The lightweight `Order` above powers the Dashboard's compact widgets and is
 * intentionally left untouched. `OrderDetail` is the full operational record
 * the Orders page works against: a made-to-measure business is a production
 * line, so the model is stage-driven, not just checkout-driven.
 * ──────────────────────────────────────────────────────────────────────── */

export type OrderType = "ready_to_wear" | "made_to_measure" | "custom_tailoring"

/**
 * A single stage vocabulary spanning the production pipeline plus terminal
 * states. The first ten are the visible pipeline; the last three sit off the
 * happy path.
 */
export type OrderStage =
  | "pending"
  | "confirmed"
  | "measurements"
  | "fabric"
  | "tailoring"
  | "quality_check"
  | "ready"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refund_requested"
  | "refunded"

export type PaymentState =
  | "paid"
  | "partially_paid"
  | "unpaid"
  | "refund_requested"
  | "refunded"

export type ShippingState =
  | "not_shipped"
  | "processing"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "returned"

export type ShippingScope = "domestic" | "international"

export type OrderPriority = "standard" | "high" | "urgent"

export interface OrderCustomer {
  id: string
  name: string
  initials: string
  email: string
  phone: string
  country: string
  /** Emoji flag, kept in data so the UI stays presentation-only. */
  flag: string
  city: string
  addressLine: string
  vip: boolean
  ordersCount: number
  lifetimeValue: number
}

export interface OrderLineItem {
  id: string
  name: string
  /** ProductThumb swatch seed (maroon, navy, charcoal…). */
  image: string
  type: OrderType
  fabric?: string
  color: string
  size: string
  quantity: number
  unitPrice: number
}

/** Body measurements in inches for made-to-measure / custom work. */
export interface OrderMeasurements {
  chest: number
  waist: number
  hips: number
  shoulder: number
  sleeve: number
  neck: number
  inseam: number
  height: number
  notes?: string
  referenceImages: string[]
}

export interface OrderTimelineStep {
  stage: OrderStage
  /** ISO timestamp when reached, or null if not yet reached. */
  at: string | null
}

export interface OrderActivityEntry {
  id: string
  actor: string
  action: string
  at: string
}

export interface OrderPaymentInfo {
  method: string
  status: PaymentState
  transactionId: string
  subtotal: number
  shipping: number
  discount: number
  tax: number
  total: number
  paid: number
}

export interface OrderShipmentInfo {
  scope: ShippingScope
  status: ShippingState
  method: string
  courier: string
  trackingNumber: string | null
  estimatedDelivery: string | null
  address: string
}

export interface OrderDetail {
  id: string
  reference: string
  type: OrderType
  stage: OrderStage
  priority: OrderPriority
  customer: OrderCustomer
  items: OrderLineItem[]
  itemCount: number
  total: number
  payment: OrderPaymentInfo
  shipment: OrderShipmentInfo
  measurements: OrderMeasurements | null
  assignedTailor: string | null
  /** Occasion the garment is for — drives deadline urgency. */
  eventDate: string | null
  deliveryDeadline: string | null
  customerNote: string | null
  internalNote: string | null
  timeline: OrderTimelineStep[]
  activity: OrderActivityEntry[]
  createdAt: string
  updatedAt: string
}

export interface TrendPoint {
  value: number
}

export interface Metric {
  id: string
  label: string
  value: string
  rawChange: number
  trend: "up" | "down"
  comparison: string
  spark: TrendPoint[]
  intent?: "default" | "warning"
}
