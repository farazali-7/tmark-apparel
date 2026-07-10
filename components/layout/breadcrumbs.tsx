"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { ADMIN_ROOT } from "@/config/nav"
import { cn } from "@/lib/utils"

const LABELS: Record<string, string> = {
  products: "Products",
  categories: "Categories",
  collections: "Collections",
  orders: "Orders",
  customers: "Customers",
  reviews: "Reviews",
  settings: "Settings",
  coupons: "Promotions",
  banners: "Campaigns",
  homepage: "Homepage Builder",
  analytics: "Analytics",
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // The /admin prefix is the crumb trail's root ("Dashboard"), not a crumb.
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .slice(ADMIN_ROOT.split("/").filter(Boolean).length)

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm md:flex">
      <Link
        href={ADMIN_ROOT}
        aria-current={segments.length === 0 ? "page" : undefined}
        className={cn(
          "text-muted-foreground transition-colors hover:text-foreground",
          segments.length === 0 && "font-medium text-foreground"
        )}
      >
        Dashboard
      </Link>
      {segments.map((segment, i) => {
        const href = `${ADMIN_ROOT}/${segments.slice(0, i + 1).join("/")}`
        const isLast = i === segments.length - 1
        const label = LABELS[segment] ?? segment
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            {isLast ? (
              <span aria-current="page" className="font-medium">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
