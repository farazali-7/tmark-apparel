"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartCard } from "@/components/shared/chart-card"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { revenueSeries } from "@/lib/mock-data/dashboard"

const chartConfig = {
  revenue: { label: "This month", color: "var(--chart-1)" },
  previous: { label: "Last month", color: "var(--chart-4)" },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <ChartCard
      title="Revenue"
      description="Daily net revenue, current vs. previous month"
      action={<StatusBadge label="+8.1%" tone="success" />}
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
        <AreaChart data={revenueSeries} margin={{ left: 4, right: 8, top: 4 }}>
          <defs>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.24} />
              <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            interval={4}
            className="text-[0.7rem]"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            className="text-[0.7rem]"
          />
          <ChartTooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value, name) => [
                  `PKR ${Number(value).toLocaleString()}`,
                  name === "revenue" ? " This month" : " Last month",
                ]}
              />
            }
          />
          <Area
            dataKey="previous"
            type="monotone"
            stroke="var(--color-previous)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="none"
          />
          <Area
            dataKey="revenue"
            type="monotone"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            fill="url(#fillRevenue)"
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}
