import type { ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { StatusTone } from "@/lib/constants"

/** Card wrapper for a group of related settings. */
export function SettingsSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border bg-card", className)}>
      <header className="flex items-start justify-between gap-4 border-b px-4 py-3.5 sm:px-5">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      <div className="divide-y">{children}</div>
    </section>
  )
}

/** A single labelled setting row — label/description left, control right. */
export function SettingRow({
  label,
  description,
  htmlFor,
  children,
  className,
  stacked = false,
}: {
  label: string
  description?: string
  htmlFor?: string
  children: ReactNode
  className?: string
  stacked?: boolean
}) {
  return (
    <div
      className={cn(
        "gap-3 px-4 py-4 sm:px-5",
        stacked ? "space-y-2" : "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-0.5 sm:max-w-[60%]">
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </Label>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className={cn(stacked ? "" : "sm:min-w-[16rem] sm:max-w-[22rem] sm:shrink-0")}>
        {children}
      </div>
    </div>
  )
}

/** Convenience text input bound to a value/onChange. */
export function SettingInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  className,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  prefix?: string
  className?: string
}) {
  if (prefix) {
    return (
      <div className={cn("flex items-center rounded-lg border bg-transparent focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30", className)}>
        <span className="px-2.5 text-sm text-muted-foreground">{prefix}</span>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 w-full rounded-r-lg bg-transparent pr-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    )
  }
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn("h-9 w-full", className)}
    />
  )
}

const TONE_DOT: Record<StatusTone, string> = {
  neutral: "bg-muted-foreground/50",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  info: "bg-sky-500",
  danger: "bg-rose-500",
  gold: "bg-gold",
}

/** Small status pill: coloured dot + label. */
export function StatusIndicator({
  label,
  tone,
  className,
}: {
  label: string
  tone: StatusTone
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span className={cn("size-1.5 rounded-full", TONE_DOT[tone])} />
      {label}
    </span>
  )
}
