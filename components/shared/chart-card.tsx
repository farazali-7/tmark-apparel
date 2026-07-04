import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: ChartCardProps) {
  return (
    <Card className={cn("gap-0 overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 border-b [.border-b]:pb-4">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-xs">{description}</CardDescription>
          ) : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className={cn("pt-5", contentClassName)}>{children}</CardContent>
    </Card>
  )
}
