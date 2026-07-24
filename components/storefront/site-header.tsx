"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, User } from "lucide-react"

import { SITE_CONTAINER } from "@/components/storefront/container"
import { MegaMenuItem } from "@/components/storefront/mega-menu"
import { SiteSearch } from "@/components/storefront/site-search"
import { MAIN_NAV, UTILITY_NAV, type NavItem } from "@/config/navigation"
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Which mobile-drawer item is expanded (one open at a time — an accordion).
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  // How far the header is currently pulled up, in px (0 = fully open, height = hidden).
  const [offset, setOffset] = useState(0)
  const lastScrollY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const frame = useRef(0)
  const pathname = usePathname()

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

  /**
   * Full-screen menu scroll lock. `overflow: hidden` alone is not enough on iOS
   * — Safari keeps rubber-banding and forgets the offset — so the body is pinned
   * with `position: fixed` at a negative top and the exact scroll position is
   * restored on close. `lastScrollY` is resynced first so the reveal logic
   * doesn't read the restore as a giant scroll jump and hide the header.
   * Any expanded accordion section is left as-is for the next open, which keeps
   * this effect free of cascading setState.
   */
  useEffect(() => {
    if (!menuOpen) return
    const body = document.body
    const scrollY = window.scrollY
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.width = "100%"
    body.style.overflow = "hidden"

    return () => {
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.width = previous.width
      body.style.overflow = previous.overflow
      lastScrollY.current = scrollY
      window.scrollTo(0, scrollY)
    }
  }, [menuOpen])

  // At rest the header floats transparently over the hero (white text); once
  // scrolled — or when the mobile drawer / search opens over an image — it needs
  // the solid, frosted treatment for legibility.
  const solid = scrolled || menuOpen || searchOpen

  // Home ("/") is never "active"; every other item lights up on its own branch.
  const isActive = (href: string) =>
    href !== "/" && (pathname === href || pathname.startsWith(`${href}/`))

  const focusRing = cn(
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    solid
      ? "focus-visible:ring-neutral-800 focus-visible:ring-offset-white"
      : "focus-visible:ring-white focus-visible:ring-offset-transparent"
  )
  const iconColor = solid ? "text-neutral-800" : "text-white"
  // 44px minimum touch target on every icon control, per Apple HIG.
  const iconClasses = cn(
    "inline-flex min-h-11 min-w-11 items-center justify-center transition-[color,opacity] duration-[var(--dur-text)] hover:opacity-70",
    iconColor,
    focusRing
  )

  // Only the solid, pinned header rides with the scroll; an open drawer or search
  // field pins it so neither slides away mid-interaction.
  const translateY = solid && !menuOpen && !searchOpen ? offset : 0

  return (
    <header
      ref={headerRef}
      style={{ transform: `translate3d(0, -${translateY}px, 0)` }}
      className={cn(
        "inset-x-0 z-40 will-change-transform",
        // Colours, border and shadow ease together on the solid handoff; the
        // transform stays untransitioned so it tracks the wheel 1px-for-1px.
        "transition-[background-color,border-color,box-shadow] duration-[var(--dur-nav)] ease-[var(--ease-luxe)]",
        solid
          ? // Frosted ivory, not flat white — reads as expensive over photography.
            "fixed top-0 border-b border-[var(--rule)] bg-[var(--paper)]/85 backdrop-blur-md shadow-[0_1px_24px_-14px_rgba(27,29,26,0.4)]"
          : "absolute top-11 bg-transparent"
      )}
    >
      {/* Inner bar. Height eases down on the solid handoff (one calm step, not a
          scrubbed shrink). On first load it fades and settles down a few px. */}
      <div
        className={cn(
          SITE_CONTAINER,
          "flex items-center justify-between lg:justify-start",
          "transition-[height] duration-[var(--dur-nav)] ease-[var(--ease-luxe)]",
          solid ? "h-16" : "h-20",
          "animate-in fade-in slide-in-from-top-2 fill-mode-both duration-700 [animation-delay:120ms]"
        )}
      >
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => {
            setSearchOpen(false)
            setMenuOpen((open) => !open)
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={MOBILE_NAV_ID}
          className={cn(
            "-ml-2 inline-flex min-h-11 min-w-11 items-center justify-center lg:hidden",
            iconColor,
            focusRing
          )}
        >
          {/* True three-line morph: the outer bars rotate into an X while the
              middle one fades out. Bars are drawn, not icon-swapped, so the
              transition is continuous rather than a crossfade. */}
          <span aria-hidden className="relative block h-4 w-6">
            {[
              { base: "top-0", open: "top-1/2 -translate-y-1/2 rotate-45" },
              { base: "top-1/2 -translate-y-1/2", open: "opacity-0" },
              { base: "bottom-0", open: "bottom-1/2 translate-y-1/2 -rotate-45" },
            ].map((bar, index) => (
              <span
                key={index}
                className={cn(
                  "absolute left-0 block h-px w-full bg-current transition-[transform,opacity,top,bottom] duration-300 ease-[var(--ease-luxe)]",
                  menuOpen ? bar.open : bar.base
                )}
              />
            ))}
          </span>
        </button>

        <Link
          href="/"
          className={cn(
            // The logo exists, it never performs: a hair of opacity on hover, and
            // a barely-there scale-down as the bar shrinks. No bounce, no spin.
            // Laptop trims the logo ~5% to buy nav room; XL restores it.
            "origin-left font-serif text-2xl tracking-[0.15em] transition-[transform,color,opacity] duration-[var(--dur-nav)] ease-[var(--ease-luxe)] hover:opacity-80 sm:text-3xl lg:text-[1.7rem] xl:text-3xl",
            solid ? "scale-[0.97] text-neutral-900" : "scale-100 text-white",
            focusRing
          )}
        >
          T-Mark Apparel
        </Link>

        {/* Laptop tightens the gaps rather than dropping links; XL breathes. */}
        <nav
          aria-label="Primary"
          className="hidden items-center lg:ml-6 lg:flex lg:gap-5 xl:ml-8 xl:gap-7"
        >
          {MAIN_NAV.map((item) => {
            const active = isActive(item.href)
            const triggerClassName = cn(
              // Whisper, not shout: uppercase, medium weight, wide tracking.
              "relative text-xs font-medium uppercase tracking-[0.12em]",
              // A hairline underline grows from the CENTRE outward (background
              // position 50%) — more elegant than a left-to-right wipe, and it
              // needs no extra DOM so it works on plain and mega triggers alike.
              "bg-no-repeat [background-position:50%_100%]",
              "transition-[background-size,color] duration-[var(--dur-underline)] ease-[var(--ease-luxe)]",
              // THE signature detail: the current section is marked in antique
              // brass, never in the text colour. It is the one flash of metal in
              // the whole chrome — reserved for "you are here" and nothing else.
              // Over the hero it falls back to white, where brass would go muddy
              // against photography.
              active && solid
                ? "bg-[linear-gradient(var(--zari),var(--zari))]"
                : "bg-[linear-gradient(currentColor,currentColor)]",
              active
                ? "[background-size:100%_2px]"
                : "[background-size:0%_1px] hover:[background-size:100%_1px]",
              // Text brightens on hover in both header states.
              solid
                ? active
                  ? "text-neutral-950"
                  : "text-neutral-700 hover:text-neutral-950"
                : active
                  ? "text-white"
                  : "text-white/85 hover:text-white",
              focusRing
            )

            return item.megaMenu ? (
              <MegaMenuItem
                key={item.label}
                item={item}
                menu={item.megaMenu}
                triggerClassName={triggerClassName}
              />
            ) : (
              <Link key={item.label} href={item.href} className={triggerClassName}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Utilities — search · account · the single primary CTA. Pushed right on
            desktop; the CTA is desktop-only (mobile books from the drawer). */}
        <div className="flex items-center gap-2 sm:gap-3 lg:ml-auto">
          <SiteSearch
            open={searchOpen}
            onOpenChange={(open) => {
              if (open) setMenuOpen(false)
              setSearchOpen(open)
            }}
            solid={solid}
            focusRing={focusRing}
            iconColor={iconColor}
          />

          <Link
            href={UTILITY_NAV.account.href}
            aria-label={UTILITY_NAV.account.label}
            className={iconClasses}
          >
            <User aria-hidden className="h-5 w-5" />
          </Link>

          <Link
            href={UTILITY_NAV.bookAppointment.href}
            className={cn(
              // CTA hover is almost invisible: tone deepens, a soft shadow drifts
              // in, the border fades into the fill. No scale, no glow, no bounce.
              // Appears from tablet up — secondary actions stay in the drawer.
              "hidden min-h-11 whitespace-nowrap border px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] md:inline-flex md:items-center lg:px-5",
              "transition-[background-color,color,border-color,box-shadow] duration-[var(--dur-text)] ease-[var(--ease-luxe)]",
              solid
                ? "border-brand-sage bg-brand-sage text-white hover:bg-brand-sage/90 hover:shadow-[0_10px_28px_-14px_rgba(92,109,89,0.75)]"
                : "border-white/60 text-white hover:border-white hover:bg-white hover:text-neutral-900",
              focusRing
            )}
          >
            {UTILITY_NAV.bookAppointment.label}
          </Link>
        </div>
      </div>

      {/* Full-screen mobile drawer — an immersive ivory sheet rather than a tiny
          dropdown. It stays mounted so it can fade + settle both ways; `inert`
          takes it out of the tab order and pointer flow while closed. */}
      <div
        className={cn(
          "fixed inset-0 z-30 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-[var(--ink)]/25 transition-opacity duration-[var(--dur-nav)] ease-[var(--ease-luxe)]",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />

        <nav
          id={MOBILE_NAV_ID}
          aria-label="Primary"
          inert={!menuOpen}
          className={cn(
            "absolute inset-0 flex flex-col bg-[var(--paper)]",
            "transition-[opacity,transform] duration-[var(--dur-nav)] ease-[var(--ease-luxe)]",
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          )}
        >
          {/* Only this region scrolls. `overscroll-contain` stops iOS from
              rubber-banding the locked page behind the sheet, and the top pad
              clears the fixed header plus any notch / Dynamic Island. */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-6 pb-6 pt-[calc(6rem+env(safe-area-inset-top))]">
          {MAIN_NAV.map((item, index) => {
            // The desktop mega menu collapses to a one-level accordion: tapping a
            // section expands its groups (occasions, garments, collections,
            // experience). Ready-to-Wear's child tree expands the same way.
            const groups: { heading?: string; links: NavItem[] }[] = item.megaMenu
              ? [
                  item.megaMenu.occasions,
                  item.megaMenu.garments,
                  item.megaMenu.collections,
                  item.megaMenu.experience,
                ]
              : item.children
                ? [{ links: item.children }]
                : []
            const active = isActive(item.href)
            const expandable = groups.length > 0
            const expanded = mobileExpanded === item.label

            return (
              <div
                key={item.label}
                className={cn(
                  "border-b border-[var(--rule)] pb-4",
                  // A gentle top-down stagger as the sheet opens.
                  menuOpen &&
                    "animate-in fade-in slide-in-from-top-1 fill-mode-both duration-[var(--dur-mega)]"
                )}
                style={menuOpen ? { animationDelay: `${120 + index * 40}ms` } : undefined}
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "font-serif text-2xl tracking-wide transition-colors",
                      active ? "text-neutral-950" : "text-neutral-900",
                      focusRing
                    )}
                  >
                    {item.label}
                  </Link>
                  {expandable ? (
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpanded(expanded ? null : item.label)
                      }
                      aria-expanded={expanded}
                      aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
                      className={cn("-mr-2 p-2 text-neutral-500", focusRing)}
                    >
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "h-5 w-5 transition-transform duration-[var(--dur-text)] ease-[var(--ease-luxe)]",
                          expanded && "rotate-180"
                        )}
                      />
                    </button>
                  ) : null}
                </div>

                {expandable && expanded ? (
                  <div className="mt-3 flex flex-col gap-4 animate-in fade-in slide-in-from-top-1 duration-[var(--dur-dropdown)]">
                    {groups.map((group, groupIndex) => (
                      <div key={group.heading ?? groupIndex}>
                        {group.heading ? (
                          <h4 className="mb-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-neutral-400">
                            {group.heading}
                          </h4>
                        ) : null}
                        <ul className="flex flex-col gap-2">
                          {group.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                  "text-sm text-neutral-600 transition-colors hover:text-neutral-900",
                                  focusRing
                                )}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}

          </div>

          {/* Pinned footer — the primary CTA is always in reach without
              scrolling, and it clears the home indicator on modern phones. */}
          <div className="flex shrink-0 flex-col gap-4 border-t border-[var(--rule)] px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <Link
              href={UTILITY_NAV.bookAppointment.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "inline-flex items-center justify-center bg-brand-sage px-5 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors duration-[var(--dur-text)] hover:bg-brand-sage/90",
                focusRing
              )}
            >
              {UTILITY_NAV.bookAppointment.label}
            </Link>
            <Link
              href={UTILITY_NAV.account.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:text-neutral-950",
                focusRing
              )}
            >
              <User aria-hidden className="h-4 w-4" />
              {UTILITY_NAV.account.label}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
