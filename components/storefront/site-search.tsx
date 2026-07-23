"use client"

import { useEffect, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

import { UTILITY_NAV } from "@/config/navigation"
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
      className="flex items-center"
    >
      {/* The field grows from 0 width; overflow-hidden keeps the collapsed state
          from stealing clicks or tab stops mid-transition. */}
      <div
        className={cn(
          "overflow-hidden transition-[width,opacity] duration-[var(--dur-search)] ease-[var(--ease-luxe)]",
          open ? "w-40 opacity-100 sm:w-60" : "w-0 opacity-0"
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
        className={cn(
          "inline-flex items-center justify-center p-1 transition-opacity hover:opacity-70",
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
    </form>
  )
}
