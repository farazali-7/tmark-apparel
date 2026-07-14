"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Menu, Search, X } from "lucide-react"

import { SITE_CONTAINER } from "@/components/storefront/container"
import { MegaMenuItem } from "@/components/storefront/mega-menu"
import { MAIN_NAV } from "@/config/navigation"
import { cn } from "@/lib/utils"

const MOBILE_NAV_ID = "site-mobile-nav"

/**
 * The chrome hands off exactly when the top bar (h-11 = 44px) finishes scrolling
 * away: at that scroll offset the absolute header's top edge reaches the viewport
 * top, so swapping to `fixed top-0` is seamless. Keep in sync with the bar height.
 */
const SOLID_SCROLL_THRESHOLD = 44
/**
 * The header only starts retracting once we're a comfortable distance into the
 * page — pulling it up the moment it turns solid feels abrupt so close to the top.
 */
const HIDE_SCROLL_THRESHOLD = 120
/**
 * Scrolling up reveals the header more eagerly than scrolling down hides it, so a
 * small flick upward brings the whole nav back rather than dragging it 1:1.
 */
const REVEAL_MULTIPLIER = 1.8

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // How far the header is currently pulled up, in px (0 = fully open, height = hidden).
  const [offset, setOffset] = useState(0)
  const lastScrollY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const frame = useRef(0)

  useEffect(() => {
    const update = () => {
      const y = Math.max(0, window.scrollY)
      setScrolled(y > SOLID_SCROLL_THRESHOLD)

      const height = headerRef.current?.offsetHeight ?? 80
      const rawDelta = y - lastScrollY.current
      lastScrollY.current = y

      // Down tracks the wheel 1:1 (pulls the header up); up is amplified so a
      // small flick reveals the whole nav rather than dragging it back inch by inch.
      const delta = rawDelta < 0 ? rawDelta * REVEAL_MULTIPLIER : rawDelta

      // Near the top the header always rides fully open; past the reveal point it
      // rides with the scroll, clamped so it never travels past its own height.
      setOffset((current) =>
        y <= HIDE_SCROLL_THRESHOLD
          ? 0
          : Math.min(height, Math.max(0, current + delta))
      )
    }

    // Coalesce bursts of scroll events into one paint for buttery tracking.
    const onScroll = () => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Escape closes the mobile drawer and returns focus to its trigger — expected
  // of any disclosure widget.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
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

  // Only the solid, pinned header rides with the scroll; the drawer pins it open
  // so the mobile menu never slides away mid-interaction.
  const translateY = solid && !menuOpen ? offset : 0

  return (
    <header
      ref={headerRef}
      style={{ transform: `translate3d(0, -${translateY}px, 0)` }}
      className={cn(
        "inset-x-0 z-40 will-change-transform",
        // Colours ease; the transform stays untransitioned so it tracks the
        // wheel exactly, 1px of scroll to 1px of travel.
        "transition-[background-color,border-color] duration-300",
        solid
          ? "fixed top-0 bg-white border-b border-neutral-200"
          : "absolute top-11 bg-transparent"
      )}
    >
      <div
        className={cn(
          SITE_CONTAINER,
          "h-20 flex items-center justify-between lg:justify-start"
        )}
      >
        <button
          ref={menuButtonRef}
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
          {MAIN_NAV.map((item) => {
            const triggerClassName = cn(
              "text-sm transition-colors",
              solid ? "text-neutral-700 hover:text-neutral-950" : "text-white hover:opacity-80",
              focusRing
            )

            return item.mega ? (
              <MegaMenuItem key={item.label} item={item} triggerClassName={triggerClassName} />
            ) : (
              <Link key={item.label} href={item.href} className={triggerClassName}>
                {item.label}
              </Link>
            )
          })}
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
          {MAIN_NAV.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn("text-sm text-neutral-900", focusRing)}
              >
                {item.label}
              </Link>
              {item.mega ? (
                <ul className="ml-3 flex flex-col gap-2 border-l border-neutral-200 pl-3">
                  {item.mega.map((column) => (
                    <li key={column.occasion.label}>
                      <Link
                        href={column.occasion.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn("text-sm text-neutral-600", focusRing)}
                      >
                        {column.occasion.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}
