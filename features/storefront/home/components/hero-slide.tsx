import Link from "next/link"

import { SITE_SHELL } from "@/components/storefront/container"
import { MediaPlaceholder } from "@/components/storefront/media-placeholder"
import { HeroMediaToggle } from "@/features/storefront/home/components/hero-media-toggle"
import { cn } from "@/lib/utils"
import type { HeroSlideContent } from "@/types"

interface HeroSlideProps {
  content: HeroSlideContent
  /**
   * A page may only have one <h1>. The first hero owns it; subsequent heroes
   * are <h2> so the document outline stays valid.
   */
  headingLevel: 1 | 2
  className?: string
}

export function HeroSlide({ content, headingLevel, className }: HeroSlideProps) {
  const { id, headingLines, eyebrow, cta, mediaLabel, hasVideo } = content
  const Heading = headingLevel === 1 ? "h1" : "h2"
  const headingId = `${id}-heading`

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative h-[78vh] min-h-[420px] max-h-[820px] w-full overflow-hidden",
        className
      )}
    >
      <MediaPlaceholder label={mediaLabel} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 flex items-end">
        <div className={cn(SITE_SHELL, "w-full px-6 sm:px-10 pb-16 sm:pb-24")}>
          <Heading
            id={headingId}
            className="font-serif uppercase text-white text-5xl leading-[1.05]"
          >
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </Heading>

          <p className="mt-4 text-white text-xs tracking-[0.25em] uppercase">{eyebrow}</p>

          <Link
            href={cta.href}
            className="mt-6 inline-block border border-white text-white text-xs tracking-[0.2em] uppercase px-7 py-3 hover:bg-white hover:text-neutral-900 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            {cta.label}
          </Link>
        </div>
      </div>

      {hasVideo && <HeroMediaToggle />}
    </section>
  )
}
