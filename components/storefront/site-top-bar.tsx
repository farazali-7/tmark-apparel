"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { SITE_CONTAINER } from "@/components/storefront/container"
import { UTILITY_NAV } from "@/config/navigation"
import { ANNOUNCEMENTS } from "@/content/homepage"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-1 focus-visible:ring-offset-brand-sage"

export function SiteTopBar() {
  const [index, setIndex] = useState(0)
  const segments = ANNOUNCEMENTS[index]

  const cycle = (direction: 1 | -1) =>
    setIndex((prev) => (prev + direction + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)

  return (
    <div className="bg-brand-sage text-white text-xs">
      <div
        className={cn(SITE_CONTAINER, "h-9 flex items-center justify-between gap-4")}
      >
        <Link
          href={UTILITY_NAV.findStore.href}
          className={cn("hidden sm:inline hover:underline whitespace-nowrap", focusRing)}
        >
          {UTILITY_NAV.findStore.label}
        </Link>

        <div
          role="region"
          aria-label="Announcements"
          className="flex items-center gap-3 mx-auto"
        >
          <button
            type="button"
            onClick={() => cycle(-1)}
            aria-label="Previous announcement"
            className={cn("hover:opacity-70", focusRing)}
          >
            <ChevronLeft aria-hidden className="w-3.5 h-3.5" />
          </button>

          <p aria-live="polite" className="whitespace-nowrap">
            {segments.map((segment) =>
              segment.href ? (
                <Link
                  key={segment.text}
                  href={segment.href}
                  className={cn("underline font-medium", focusRing)}
                >
                  {segment.text}
                </Link>
              ) : (
                <span key={segment.text}>{segment.text}</span>
              )
            )}
          </p>

          <button
            type="button"
            onClick={() => cycle(1)}
            aria-label="Next announcement"
            className={cn("hover:opacity-70", focusRing)}
          >
            <ChevronRight aria-hidden className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="hidden items-center gap-3 whitespace-nowrap sm:flex">
          <Link href={UTILITY_NAV.signIn.href} className={cn("hover:underline", focusRing)}>
            {UTILITY_NAV.signIn.label}
          </Link>
          <span aria-hidden className="h-3 w-px bg-white/40" />
          <Link
            href={UTILITY_NAV.createAccount.href}
            className={cn("hover:underline", focusRing)}
          >
            {UTILITY_NAV.createAccount.label}
          </Link>
        </div>
      </div>
    </div>
  )
}
