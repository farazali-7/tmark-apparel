import Link from "next/link"

import { SITE_CONTAINER } from "@/components/storefront/container"
import { MediaPlaceholder } from "@/components/storefront/media-placeholder"
import { cn } from "@/lib/utils"
import type { CategoryTile } from "@/types"

interface TileRowProps {
  tiles: CategoryTile[]
  ariaLabel: string
  /**
   * Category rows print their label over the image; editorial rows are pure
   * imagery, so the label is exposed to assistive tech only.
   */
  showLabels?: boolean
}

export function TileRow({ tiles, ariaLabel, showLabels = false }: TileRowProps) {
  return (
    <section aria-label={ariaLabel} className={cn(SITE_CONTAINER, "pt-12")}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="group relative block aspect-[4/5] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-800"
          >
            <MediaPlaceholder
              label={tile.mediaLabel ?? tile.label}
              className="absolute inset-0 w-full h-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
            {showLabels ? (
              <>
                {/* Grounds the label so it stays legible over lighter imagery. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 flex justify-center pb-6">
                  <span className="font-serif text-white text-2xl tracking-[0.1em] uppercase drop-shadow transition-transform duration-300 group-hover:-translate-y-1">
                    {tile.label}
                  </span>
                </span>
              </>
            ) : (
              <span className="sr-only">{tile.label}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
