"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface ChipMultiSelectProps {
  options: readonly string[]
  value: string[]
  onChange: (value: string[]) => void
  className?: string
}

export function ChipMultiSelect({
  options,
  value,
  onChange,
  className,
}: ChipMultiSelectProps) {
  function toggle(option: string) {
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option]
    )
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((option) => {
        const active = value.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            )}
          >
            {active ? <Check className="size-3" /> : null}
            {option}
          </button>
        )
      })}
    </div>
  )
}
