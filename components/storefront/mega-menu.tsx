"use client"

import { useEffect, useId, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

import { MediaPlaceholder } from "@/components/storefront/media-placeholder"
import type { MegaGroup, MegaLink, MegaMenu, NavItem } from "@/config/navigation"
import { cn } from "@/lib/utils"

interface MegaMenuItemProps {
  item: NavItem
  menu: MegaMenu
  /** Visual classes for the trigger, so it matches the sibling nav links. */
  triggerClassName: string
}

/** Mouse-in waits a beat (intent, not a graze); mouse-out keeps a grace window. */
const OPEN_DELAY = 90
const CLOSE_GRACE = 120

/**
 * The Wedding "showroom" — a five-zone editorial panel, not a dropdown. It stays
 * mounted and animates both ways with transitions; `inert` removes it from tab +
 * pointer flow while closed. The panel is width-capped to the viewport from the
 * trigger's left edge, so it never overflows on narrow laptops while remaining a
 * DOM child of the hover container (which keeps the trigger→panel bridge intact).
 * Reduced-motion collapses every transition to instant via the global rule.
 */
export function MegaMenuItem({ item, menu, triggerClassName }: MegaMenuItemProps) {
  const [open, setOpen] = useState(false)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>()
  // The garment currently hovered drives the editorial image swap.
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null)
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLAnchorElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  // Keyboard focus opens immediately; a hover waits a beat so a diagonal pass
  // across the nav doesn't flash the panel open.
  const openNow = () => {
    clearTimers()
    setOpen(true)
  }
  const openSoon = () => {
    clearTimers()
    openTimer.current = setTimeout(() => setOpen(true), OPEN_DELAY)
  }
  const closeSoon = () => {
    clearTimers()
    closeTimer.current = setTimeout(() => {
      setOpen(false)
      setPreview(null)
    }, CLOSE_GRACE)
  }

  useEffect(() => clearTimers, [])

  // Cap the panel width so it fits between the trigger's left edge and the
  // viewport's right edge; recompute while open on resize.
  useEffect(() => {
    if (!open) return
    const measure = () => {
      const left = triggerRef.current?.getBoundingClientRect().left ?? 0
      setPanelStyle({
        width: `min(1200px, calc(100vw - ${Math.round(left)}px - 1.5rem))`,
      })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [open])

  // A pointer press anywhere outside dismisses the panel — hover-out isn't the
  // only way people leave a menu (especially on hybrid touch laptops).
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node | null)) {
        clearTimers()
        setOpen(false)
        setPreview(null)
      }
    }
    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  /** Every focusable link inside the panel, in visual order. */
  const panelLinks = () =>
    Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [])

  // Keyboard parity with the mouse: ArrowDown enters the panel, arrows walk it,
  // Home/End jump, Escape closes and hands focus back to the trigger.
  const onKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event

    if (key === "Escape" && open) {
      event.preventDefault()
      clearTimers()
      setOpen(false)
      setPreview(null)
      triggerRef.current?.focus()
      return
    }

    if (key === "ArrowDown" || key === "ArrowUp" || key === "Home" || key === "End") {
      const onTrigger = event.target === triggerRef.current

      // From the trigger, ArrowDown opens and drops into the first link.
      if (onTrigger && key === "ArrowDown") {
        event.preventDefault()
        clearTimers()
        setOpen(true)
        // Wait for the panel to leave `inert` before focusing into it.
        requestAnimationFrame(() => panelLinks()[0]?.focus())
        return
      }
      if (onTrigger) return

      const links = panelLinks()
      if (links.length === 0) return
      const current = links.indexOf(document.activeElement as HTMLAnchorElement)
      if (current === -1) return

      event.preventDefault()
      const next =
        key === "Home"
          ? 0
          : key === "End"
            ? links.length - 1
            : key === "ArrowDown"
              ? Math.min(current + 1, links.length - 1)
              : Math.max(current - 1, 0)
      links[next]?.focus()
    }
  }

  const editorialAlt = preview?.alt ?? menu.editorial.imageAlt

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openSoon}
      onMouseLeave={closeSoon}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false)
          setPreview(null)
        }
      }}
      onKeyDown={onKeyDown}
    >
      <Link
        ref={triggerRef}
        href={item.href}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onFocus={openNow}
        className={triggerClassName}
      >
        {item.label}
      </Link>

      {/* The pt gap is the invisible bridge between trigger and panel. */}
      <div
        id={panelId}
        ref={panelRef}
        inert={!open}
        className={cn(
          "absolute left-0 top-full z-50 max-w-[calc(100vw-1.5rem)] pt-[var(--s-3)]",
          "transition-[opacity,transform] duration-[var(--dur-mega)] ease-[var(--ease-luxe)]",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div
          style={panelStyle}
          className="overflow-hidden border border-[var(--rule)] bg-[var(--paper)] shadow-[0_30px_80px_-40px_rgba(27,29,26,0.55)]"
        >
          <div className="grid grid-cols-[1fr_1.15fr_1.15fr_1.7fr_1.1fr] gap-[var(--s-5)] px-[var(--s-6)] py-[var(--s-5)]">
            <MegaColumn group={menu.occasions} open={open} index={0} />
            <MegaColumn
              group={menu.garments}
              open={open}
              index={1}
              onPreview={setPreview}
            />
            <MegaColumn group={menu.collections} open={open} index={2} />

            {/* Editorial — the emotional centre. */}
            <div
              className={cn(
                "flex flex-col transition-[opacity,transform] duration-[var(--dur-mega)] ease-[var(--ease-luxe)]",
                open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
              style={{ transitionDelay: open ? "120ms" : "0ms" }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200">
                {menu.editorial.imageSrc ? (
                  <>
                    {/* Base editorial image. */}
                    <Image
                      src={menu.editorial.imageSrc}
                      alt={menu.editorial.imageAlt}
                      fill
                      sizes="420px"
                      className="object-cover object-[50%_30%]"
                    />
                    {/* Garment preview crossfades over the base on hover. */}
                    {preview ? (
                      <Image
                        key={preview.src}
                        src={preview.src}
                        alt=""
                        fill
                        sizes="420px"
                        className="animate-in fade-in object-cover object-[50%_30%] duration-[var(--dur-mega)]"
                      />
                    ) : null}
                  </>
                ) : (
                  <MediaPlaceholder
                    label={editorialAlt}
                    className="absolute inset-0 h-full w-full"
                  />
                )}
              </div>
              <p className="mt-[var(--s-3)] font-serif text-[1.05rem] leading-snug text-[var(--ink)]">
                {menu.editorial.caption}
              </p>
              <Link
                href={menu.editorial.cta.href}
                className="group/cta mt-[var(--s-2)] inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-[var(--ink)]"
              >
                {menu.editorial.cta.label}
                <span
                  aria-hidden
                  className="transition-transform duration-[var(--dur-text)] ease-[var(--ease-luxe)] group-hover/cta:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>

            <MegaColumn group={menu.experience} open={open} index={3} />
          </div>

          {/* The tailor's note carries the craft; the ticks carry the
              reassurance. Together they close the menu on trust, not on links. */}
          <div className="flex flex-wrap items-center justify-between gap-x-[var(--s-5)] gap-y-2 border-t border-[var(--rule)] px-[var(--s-6)] py-[var(--s-3)]">
            {menu.note ? (
              <p className="font-serif text-[0.8125rem] italic text-[var(--ink)]/70">
                {menu.note}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-[var(--s-5)] gap-y-2">
              {menu.trust.map((point) => (
                <span
                  key={point}
                  className="flex items-center gap-1.5 text-[0.75rem] tracking-wide text-[var(--ink)]/60"
                >
                  <Check aria-hidden strokeWidth={1.75} className="h-3.5 w-3.5 text-[var(--zari)]" />
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** One titled column. Each link slides 3px and reveals its description on hover. */
function MegaColumn({
  group,
  open,
  index,
  onPreview,
}: {
  group: MegaGroup
  open: boolean
  index: number
  onPreview?: (preview: { src: string; alt: string } | null) => void
}) {
  return (
    <div
      className={cn(
        "transition-[opacity,transform] duration-[var(--dur-mega)] ease-[var(--ease-luxe)]",
        open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      )}
      style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
    >
      <h3 className="mb-[var(--s-3)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[var(--ink)]/45">
        {group.heading}
      </h3>
      <ul className="flex flex-col gap-[var(--s-2)]">
        {group.links.map((link) => (
          <li key={link.label}>
            <MegaRow link={link} onPreview={onPreview} />
          </li>
        ))}
      </ul>
      {group.footer ? (
        <Link
          href={group.footer.href}
          className="mt-[var(--s-3)] inline-block text-[0.75rem] uppercase tracking-[0.14em] text-[var(--ink)]/60 underline underline-offset-4 transition-colors duration-[var(--dur-text)] hover:text-[var(--ink)]"
        >
          {group.footer.label}
        </Link>
      ) : null}
    </div>
  )
}

function MegaRow({
  link,
  onPreview,
}: {
  link: MegaLink
  onPreview?: (preview: { src: string; alt: string } | null) => void
}) {
  const hoverHandlers =
    onPreview && link.imageSrc
      ? {
          onMouseEnter: () =>
            onPreview({ src: link.imageSrc!, alt: link.imageAlt ?? link.label }),
        }
      : undefined

  return (
    <Link
      href={link.href}
      {...hoverHandlers}
      className="group/row block"
    >
      <span className="flex items-baseline gap-2">
        <span className="inline-block text-[0.95rem] text-[var(--ink)]/85 transition-[transform,color] duration-[var(--dur-text)] ease-[var(--ease-luxe)] group-hover/row:translate-x-[3px] group-hover/row:text-[var(--ink)]">
          {link.label}
        </span>
        {link.badge ? (
          <span className="text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-[var(--zari)]">
            {link.badge}
          </span>
        ) : null}
      </span>
      {link.description ? (
        // Present but muted; brightens as the row is hovered.
        <span className="mt-0.5 block max-w-[22ch] text-[0.75rem] leading-snug text-[var(--ink)]/40 transition-colors duration-[var(--dur-text)] group-hover/row:text-[var(--ink)]/60">
          {link.description}
        </span>
      ) : null}
    </Link>
  )
}
