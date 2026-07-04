"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"

import type { TrendPoint } from "@/types"

interface SparklineProps {
  data: TrendPoint[]
  positive?: boolean
  className?: string
}

export function Sparkline({ data, positive = true, className }: SparklineProps) {
  const id = positive ? "spark-up" : "spark-down"
  const stroke = positive
    ? "oklch(0.55 0.12 155)"
    : "oklch(0.58 0.16 25)"

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            dataKey="value"
            type="monotone"
            stroke={stroke}
            strokeWidth={1.75}
            fill={`url(#${id})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
