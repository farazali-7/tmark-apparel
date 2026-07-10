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

/** Root of the admin namespace. The storefront owns everything outside it. */
export const ADMIN_ROOT = "/admin"

/**
 * The dashboard sits at ADMIN_ROOT, which prefixes every other admin route, so
 * it only matches exactly. Everything else matches on segment boundaries —
 * a plain `startsWith` would light up /admin/products for /admin/products-xyz.
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === ADMIN_ROOT) return pathname === ADMIN_ROOT
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Admin lives under /admin so the public storefront owns the root namespace
 * (/, /collections, /products). Hrefs here are the single source of truth for
 * the sidebar, command menu and breadcrumbs.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Catalog",
    items: [
      { title: "Products", href: "/admin/products", icon: Package, badge: "312" },
      { title: "Categories", href: "/admin/categories", icon: FolderTree, badge: "12" },
      { title: "Collections", href: "/admin/collections", icon: Sparkles, badge: "10" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { title: "Orders", href: "/admin/orders", icon: ShoppingCart, badge: "18" },
      { title: "Customers", href: "/admin/customers", icon: Users, badge: "12" },
      { title: "Reviews", href: "/admin/reviews", icon: MessageSquareQuote, badge: "16" },
      { title: "Promotions", href: "/admin/coupons", icon: Tag, badge: "14" },
    ],
  },
  {
    label: "Storefront",
    items: [
      { title: "Homepage Builder", href: "/admin/homepage", icon: LayoutTemplate },
      { title: "Campaigns", href: "/admin/banners", icon: Image },
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", href: "/admin/settings", icon: Settings }],
  },
]
