"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, Search, X } from "lucide-react"

import { SITE_CONTAINER } from "@/components/storefront/container"
import { SITE_NAV } from "@/lib/mock-data/storefront"
import { cn } from "@/lib/utils"

const MOBILE_NAV_ID = "site-mobile-nav"

/**
 * The chrome hands off exactly when the sage top bar (h-9 = 36px) finishes
 * scrolling away: at that scroll offset the absolute header's top edge reaches
 * the viewport top, so swapping to `fixed top-0` is seamless.
 */
const SOLID_SCROLL_THRESHOLD = 36

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLID_SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Escape closes the mobile drawer — expected of any disclosure widget.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  // At rest the header floats transparently over the hero (white text); once
  // scrolled — or when the mobile drawer opens over an image — it needs the
  // solid white treatment for legibility.
  const solid = scrolled || menuOpen

  const focusRing = cn(
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    solid
      ? "focus-visible:ring-neutral-800 focus-visible:ring-offset-white"
      : "focus-visible:ring-white focus-visible:ring-offset-transparent"
  )
  const iconColor = solid ? "text-neutral-800" : "text-white"

  return (
    <header
      className={cn(
        "inset-x-0 z-40 transition-colors duration-200",
        solid
          ? "fixed top-0 bg-white border-b border-neutral-200"
          : "absolute top-9 bg-transparent"
      )}
    >
      <div
        className={cn(
          SITE_CONTAINER,
          "h-20 flex items-center justify-between lg:justify-start"
        )}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={MOBILE_NAV_ID}
          className={cn("lg:hidden", iconColor, focusRing)}
        >
          {menuOpen ? (
            <X aria-hidden className="w-6 h-6" />
          ) : (
            <Menu aria-hidden className="w-6 h-6" />
          )}
        </button>

        <Link
          href="/"
          className={cn(
            "font-serif text-2xl sm:text-3xl tracking-[0.15em]",
            solid ? "text-neutral-900" : "text-white",
            focusRing
          )}
        >
          T-Mark Apparel
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7 lg:ml-8">
          {SITE_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                solid
                  ? "text-neutral-700 hover:text-neutral-950"
                  : "text-white hover:opacity-80",
                focusRing
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Search"
          className={cn(
            "lg:ml-auto hover:opacity-70 transition-opacity",
            iconColor,
            focusRing
          )}
        >
          <Search aria-hidden className="w-5 h-5" />
        </button>
      </div>

      {menuOpen && (
        <nav
          id={MOBILE_NAV_ID}
          aria-label="Primary"
          className="lg:hidden bg-white border-t border-neutral-200 px-4 py-3 flex flex-col gap-3"
        >
          {SITE_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cn("text-sm text-neutral-700", focusRing)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
