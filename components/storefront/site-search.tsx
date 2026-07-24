"use client"

import { useEffect, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

import Link from "next/link"

import { POPULAR_SEARCHES, UTILITY_NAV } from "@/config/navigation"
import { cn } from "@/lib/utils"

interface SiteSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Header is on its solid (ivory) treatment — drives legible input colours. */
  solid: boolean
  /** Shared focus-ring classes so the toggle matches sibling controls. */
  focusRing: string
  /** Icon tint that tracks the header's transparent/solid state. */
  iconColor: string
}

const INPUT_ID = "site-search-input"

/**
 * The search icon expands into an inline field rather than routing to a full
 * page — luxury users search rarely, so it stays out of the way until asked
 * for. Opening it turns the whole header solid (see SiteHeader's `solid`), which
 * gives this input a legible background over the hero for free.
 */
export function SiteSearch({
  open,
  onOpenChange,
  solid,
  focusRing,
  iconColor,
}: SiteSearchProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Move focus into the field the moment it opens.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Escape closes and returns focus to the toggle; a pointer-down anywhere
  // outside the field dismisses it — both expected of an expanding disclosure.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
        toggleRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!formRef.current?.contains(event.target as Node | null)) {
        onOpenChange(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("pointerdown", onPointerDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open, onOpenChange])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = inputRef.current?.value.trim()
    if (!query) {
      inputRef.current?.focus()
      return
    }
    onOpenChange(false)
    router.push(`${UTILITY_NAV.search.href}?q=${encodeURIComponent(query)}`)
  }

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={handleSubmit}
      className="relative flex items-center"
    >
      {/* The field grows from 0 width; overflow-hidden keeps the collapsed state
          from stealing clicks or tab stops mid-transition. */}
      <div
        className={cn(
          "overflow-hidden transition-[width,opacity] duration-[var(--dur-search)] ease-[var(--ease-luxe)]",
          open ? "w-[min(56vw,15rem)] opacity-100 sm:w-60" : "w-0 opacity-0"
        )}
      >
        <label htmlFor={INPUT_ID} className="sr-only">
          {UTILITY_NAV.search.label} garments
        </label>
        <input
          ref={inputRef}
          id={INPUT_ID}
          type="search"
          name="q"
          enterKeyHint="search"
          placeholder="Search garments…"
          tabIndex={open ? 0 : -1}
          className={cn(
            "w-full border-b bg-transparent py-1 text-sm outline-none transition-colors",
            solid
              ? "border-neutral-300 text-neutral-900 placeholder:text-neutral-400"
              : "border-white/50 text-white placeholder:text-white/60"
          )}
        />
      </div>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label={open ? "Close search" : UTILITY_NAV.search.label}
        aria-expanded={open}
        aria-controls={INPUT_ID}
        // 44px minimum touch target (Apple HIG) even though the glyph is 20px.
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center justify-center transition-opacity duration-[var(--dur-text)] hover:opacity-70",
          iconColor,
          focusRing
        )}
      >
        {open ? (
          <X aria-hidden className="h-5 w-5" />
        ) : (
          <Search aria-hidden className="h-5 w-5" />
        )}
      </button>

      {/* Popular entry points — the field is never a dead empty box. */}
      <div
        inert={!open}
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-56 border border-[var(--line)] bg-[var(--paper)] p-[var(--s-3)] shadow-[0_24px_60px_-36px_rgba(27,29,26,0.6)]",
          "transition-[opacity,transform] duration-[var(--dur-search)] ease-[var(--ease-luxe)]",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <p className="mb-[var(--s-2)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[var(--ink)]/45">
          Popular
        </p>
        <ul className="flex flex-col gap-1.5">
          {POPULAR_SEARCHES.map((suggestion) => (
            <li key={suggestion.label}>
              <Link
                href={suggestion.href}
                onClick={() => onOpenChange(false)}
                className="group/suggestion block py-0.5 text-[0.875rem] text-[var(--ink)]/80 transition-colors duration-[var(--dur-text)] hover:text-[var(--ink)]"
              >
                <span className="inline-block transition-transform duration-[var(--dur-text)] ease-[var(--ease-luxe)] group-hover/suggestion:translate-x-[3px]">
                  {suggestion.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </form>
  )
}
