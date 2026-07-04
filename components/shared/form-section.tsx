import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "grid gap-4 rounded-xl border bg-card p-4 sm:p-5",
        className
      )}
    >
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  )
}
