"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"

import type { NavItem } from "@/config/navigation"
import { cn } from "@/lib/utils"

interface MegaMenuItemProps {
  item: NavItem
  /** Visual classes for the trigger, so it matches the sibling nav links. */
  triggerClassName: string
}

/** Mouse-in waits a beat (intent, not a graze); mouse-out keeps a grace window. */
const OPEN_DELAY = 90
const CLOSE_GRACE = 120

/**
 * A top-level nav item that opens an occasion mega menu. The trigger is still a
 * real link (navigates to the Wedding edit on click / Enter); hovering, focusing
 * or a brief intent delay opens the panel. The panel stays mounted and animates
 * both ways with transitions — `inert` removes it from tab + pointer flow while
 * closed. Escape closes and returns focus to the trigger; moving focus out of the
 * whole item closes it too. Reduced-motion collapses every transition to instant.
 */
export function MegaMenuItem({ item, triggerClassName }: MegaMenuItemProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLAnchorElement>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const columns = item.mega ?? []

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  // Keyboard focus opens immediately (no intent delay); a hover waits a beat so a
  // diagonal pass across the nav doesn't flash the panel open.
  const openNow = () => {
    clearTimers()
    setOpen(true)
  }
  const openSoon = () => {
    clearTimers()
    openTimer.current = setTimeout(() => setOpen(true), OPEN_DELAY)
  }
  // Grace on leave so a diagonal mouse path to the panel doesn't drop it.
  const closeSoon = () => {
    clearTimers()
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_GRACE)
  }

  useEffect(() => clearTimers, [])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openSoon}
      onMouseLeave={closeSoon}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false)
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false)
          triggerRef.current?.focus()
        }
      }}
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

      {/* The pt gap is an invisible bridge between trigger and panel — the mouse
          crosses it without ever leaving the hover container, so the menu can't
          drop out from under a diagonal path. */}
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "absolute left-0 top-full z-50 pt-[var(--s-3)]",
          "transition-[opacity,transform] duration-[var(--dur-mega)] ease-[var(--ease-luxe)]",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div
          className="grid grid-cols-4 gap-[var(--s-5)] border bg-[var(--paper)] px-[var(--s-5)] py-[var(--s-4)] shadow-xl"
          style={{ borderColor: "var(--line)" }}
        >
          {columns.map((column, index) => (
            <div
              key={column.occasion.label}
              // Staggered reveal — each column drifts up into place a touch after
              // the last. The delay only bites while opening.
              className={cn(
                "transition-[opacity,transform] duration-[var(--dur-mega)] ease-[var(--ease-luxe)]",
                open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
              style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
            >
              <Link
                href={column.occasion.href}
                className="mb-[var(--s-2)] block font-serif text-[0.9rem] uppercase tracking-[0.12em] text-[var(--ink)] hover:underline"
              >
                {column.occasion.label}
              </Link>
              <ul className="flex flex-col gap-[var(--s-1)]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[0.8125rem] text-[var(--ink)]/75 transition-colors duration-[var(--dur-text)] hover:text-[var(--ink)] hover:underline"
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
      </div>
    </div>
  )
}
