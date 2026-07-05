import {
  BarChart3,
  FolderTree,
  Image,
  LayoutDashboard,
  LayoutTemplate,
  MessageSquareQuote,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
  disabled?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/**
 * Only Dashboard and Products are implemented in this pass; the rest are
 * present so the shell reads like the real product and reserves routes.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Catalog",
    items: [
      { title: "Products", href: "/products", icon: Package, badge: "312" },
      { title: "Categories", href: "/categories", icon: FolderTree, badge: "12" },
      { title: "Collections", href: "/collections", icon: Sparkles, badge: "10" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { title: "Orders", href: "/orders", icon: ShoppingCart, badge: "18" },
      { title: "Customers", href: "/customers", icon: Users, disabled: true },
      { title: "Reviews", href: "/reviews", icon: MessageSquareQuote, disabled: true },
      { title: "Coupons", href: "/coupons", icon: Tag, disabled: true },
    ],
  },
  {
    label: "Storefront",
    items: [
      { title: "Homepage", href: "/homepage", icon: LayoutTemplate, disabled: true },
      { title: "Banners", href: "/banners", icon: Image, disabled: true },
      { title: "Analytics", href: "/analytics", icon: BarChart3, disabled: true },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", href: "/settings", icon: Settings, disabled: true }],
  },
]
