import Image from "next/image"
import Link from "next/link"

import { MediaPlaceholder } from "@/components/storefront/media-placeholder"
import type { CategoryTile } from "@/types"

interface TileRowProps {
  tiles: readonly CategoryTile[]
  /** Accessible name for the region (no visible heading in this band). */
  ariaLabel: string
}

// The 1.03 hover scale is the only transform allowed on the site; aspect-[4/5]
// locks the box so there is zero layout shift while the image loads.
const media =
  "object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"

export function TileRow({ tiles, ariaLabel }: TileRowProps) {
  return (
    <section
      aria-label={ariaLabel}
      className="grid grid-cols-1 gap-[var(--s-3)] px-[var(--s-4)] md:grid-cols-3"
    >
      {tiles.map((tile) => (
        <Link
          key={tile.label}
          href={tile.href}
          className="group relative block aspect-[4/5] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ink)]"
        >
          {tile.imageSrc ? (
            <Image
              src={tile.imageSrc}
              alt={tile.mediaLabel ?? tile.label}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={media}
            />
          ) : (
            <MediaPlaceholder
              label={tile.mediaLabel ?? tile.label}
              className={`absolute inset-0 h-full w-full ${media}`}
            />
          )}

          {/* Soft ink wash fades in on hover — adds depth without moving the box. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[var(--ink)]/0 transition-colors duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[var(--ink)]/15"
          />

          {/* Grounds the label so it stays legible over lighter imagery. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent transition-[height] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:h-1/2"
          />
          <span className="absolute bottom-[var(--s-4)] left-[var(--s-4)] text-[0.8125rem] uppercase tracking-[0.16em] text-[var(--paper)] transition-[letter-spacing] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:tracking-[0.26em]">
            {tile.label}
          </span>
        </Link>
      ))}
    </section>
  )
}
