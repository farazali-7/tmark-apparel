"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const LABELS: Record<string, string> = {
  products: "Products",
  categories: "Categories",
  orders: "Orders",
  customers: "Customers",
  reviews: "Reviews",
  settings: "Settings",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm md:flex">
      <Link
        href="/"
        className={cn(
          "text-muted-foreground transition-colors hover:text-foreground",
          segments.length === 0 && "font-medium text-foreground"
        )}
      >
        Home
      </Link>
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/")
        const isLast = i === segments.length - 1
        const label = LABELS[segment] ?? segment
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium">{label}</span>
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
