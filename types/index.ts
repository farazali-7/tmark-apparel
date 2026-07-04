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
