"use client"

import { useId, useRef, useState } from "react"
import Link from "next/link"

import type { NavItem } from "@/config/navigation"
import { cn } from "@/lib/utils"

interface MegaMenuItemProps {
  item: NavItem
  /** Visual classes for the trigger, so it matches the sibling nav links. */
  triggerClassName: string
}

/**
 * A top-level nav item that opens an occasion mega menu. The trigger is still a
 * real link (navigates to the Wedding edit on click / Enter); hovering or
 * focusing it opens the panel. Escape closes and returns focus to the trigger;
 * moving focus out of the whole item closes it too.
 */
export function MegaMenuItem({ item, triggerClassName }: MegaMenuItemProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLAnchorElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const columns = item.mega ?? []

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  // Small delay on leave so a diagonal mouse path to the panel doesn't flicker.
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
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

      <div id={panelId} hidden={!open} className="absolute left-0 top-full z-50 pt-[var(--s-3)]">
        <div
          className="grid grid-cols-4 gap-[var(--s-5)] border bg-[var(--paper)] px-[var(--s-5)] py-[var(--s-4)] shadow-xl"
          style={{ borderColor: "var(--line)" }}
        >
          {columns.map((column) => (
            <div key={column.occasion.label}>
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
                        "text-[0.8125rem] text-[var(--ink)]/75 hover:text-[var(--ink)] hover:underline"
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
