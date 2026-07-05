import {
  Crown,
  Gem,
  Globe2,
  HeartHandshake,
  Repeat,
  Scissors,
  Sparkle,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

import type { CustomerDetail } from "@/types"

export type SegmentId =
  | "vip"
  | "high_value"
  | "repeat"
  | "wedding"
  | "tailoring"
  | "international"
  | "new"
  | "inactive"

export interface CustomerSegment {
  id: SegmentId
  label: string
  description: string
  icon: LucideIcon
  /** Whether the card carries the brass accent (reserved for premium tiers). */
  accent: boolean
  match: (c: CustomerDetail) => boolean
}

const NEW_WINDOW_DAYS = 30

export function isNewCustomer(joinedAt: string): boolean {
  const days = (Date.now() - new Date(joinedAt).getTime()) / 86_400_000
  return days <= NEW_WINDOW_DAYS
}

/**
 * Segments are the CRM's answer to "who?" — each is a one-click working
 * filter, not decoration. Predicates live here beside the data so the cards,
 * the toolbar filters and the table always agree.
 */
export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    id: "vip",
    label: "VIP",
    description: "Priority clients",
    icon: Crown,
    accent: true,
    match: (c) => c.vip,
  },
  {
    id: "high_value",
    label: "High Value",
    description: "Top lifetime spend",
    icon: Gem,
    accent: true,
    match: (c) => c.lifetimeValue >= 250_000,
  },
  {
    id: "repeat",
    label: "Repeat Buyers",
    description: "Two or more orders",
    icon: Repeat,
    accent: false,
    match: (c) => c.repeatBuyer,
  },
  {
    id: "wedding",
    label: "Wedding Clients",
    description: "Wedding & occasion",
    icon: HeartHandshake,
    accent: false,
    match: (c) => c.weddingClient,
  },
  {
    id: "tailoring",
    label: "Tailoring Clients",
    description: "Bespoke & MTM",
    icon: Scissors,
    accent: false,
    match: (c) => c.tailoringClient,
  },
  {
    id: "international",
    label: "International",
    description: "Ships worldwide",
    icon: Globe2,
    accent: false,
    match: (c) => c.international,
  },
  {
    id: "new",
    label: "New Customers",
    description: "Joined this month",
    icon: UserPlus,
    accent: false,
    match: (c) => isNewCustomer(c.joinedAt),
  },
  {
    id: "inactive",
    label: "Inactive",
    description: "Needs re-engaging",
    icon: Sparkle,
    accent: false,
    match: (c) => c.status === "inactive",
  },
]
