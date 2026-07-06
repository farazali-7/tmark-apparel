import { cn } from "@/lib/utils"
import type { StatTileData } from "@/lib/mock-data/analytics"

export function StatTiles({
  tiles,
  className,
}: {
  tiles: StatTileData[]
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-xl border bg-card p-4">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">{tile.label}</p>
          <p className="mt-2 font-display text-2xl font-medium tabular">{tile.value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{tile.sub}</p>
        </div>
      ))}
    </div>
  )
}
