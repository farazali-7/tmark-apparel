import Link from "next/link"
import { MessageCircle } from "lucide-react"

import { SITE_SHELL } from "@/components/storefront/container"
import { UTILITY_NAV } from "@/config/navigation"
import { TOP_BAR } from "@/content/homepage"
import { cn } from "@/lib/utils"

const linkFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--paper)]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"

export function SiteTopBar() {
  return (
    <div className="bg-[var(--ink)] text-[var(--paper)] text-[0.8125rem] tracking-[0.08em] uppercase">
      <div
        className={cn(
          SITE_SHELL,
          "flex h-11 items-center justify-between gap-4 px-4 sm:px-8"
        )}
      >
        <Link
          href={UTILITY_NAV.atelier.href}
          className={cn("hidden whitespace-nowrap hover:underline sm:inline", linkFocus)}
        >
          {UTILITY_NAV.atelier.label}
        </Link>

        <p className="mx-auto text-center normal-case tracking-[0.06em] sm:uppercase sm:tracking-[0.08em]">
          {TOP_BAR.leadTime}{" "}
          <Link
            href={UTILITY_NAV.madeToMeasure.href}
            className={cn("underline underline-offset-4", linkFocus)}
          >
            {UTILITY_NAV.madeToMeasure.label}
          </Link>
        </p>

        {/* A human, not an account form — nobody signs up before they've spoken
            to you at this price. */}
        <Link
          href={UTILITY_NAV.whatsapp.href}
          className={cn(
            "hidden items-center gap-2 whitespace-nowrap hover:underline sm:flex",
            linkFocus
          )}
        >
          <MessageCircle aria-hidden className="h-4 w-4" />
          {UTILITY_NAV.whatsapp.label}
        </Link>
      </div>
    </div>
  )
}
