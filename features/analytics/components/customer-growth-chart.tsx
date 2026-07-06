"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { customerGrowth } from "@/lib/mock-data/analytics"

const config: ChartConfig = {
  customers: { label: "Total", color: "var(--chart-1)" },
  returning: { label: "Returning", color: "var(--gold)" },
}

export function CustomerGrowthChart() {
  return (
    <ChartContainer config={config} className="aspect-auto h-[240px] w-full">
      <AreaChart data={customerGrowth} margin={{ left: 4, right: 8, top: 4 }}>
        <defs>
          <linearGradient id="fillCustomers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-customers)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--color-customers)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} className="text-[0.7rem]" />
        <YAxis tickLine={false} axisLine={false} width={38} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} className="text-[0.7rem]" />
        <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="line" />} />
        <Area dataKey="returning" type="monotone" stroke="var(--color-returning)" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
        <Area dataKey="customers" type="monotone" stroke="var(--color-customers)" strokeWidth={2} fill="url(#fillCustomers)" />
      </AreaChart>
    </ChartContainer>
  )
}
