import Image from "next/image"
import Link from "next/link"

import { MediaPlaceholder } from "@/components/storefront/media-placeholder"
import { HeroMediaToggle } from "@/features/storefront/home/components/hero-media-toggle"
import { cn } from "@/lib/utils"
import type { HeroSlideContent } from "@/types"

interface HeroSlideProps {
  content: HeroSlideContent
  /**
   * A page may only have one <h1>. The first hero owns it; any subsequent hero
   * is <h2> so the document outline stays valid.
   */
  headingLevel: 1 | 2
  className?: string
}

export function HeroSlide({ content, headingLevel, className }: HeroSlideProps) {
  const { id, headingLines, eyebrow, cta, imageSrc, mediaLabel, hasVideo } = content
  const Heading = headingLevel === 1 ? "h1" : "h2"
  const headingId = `${id}-heading`

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative min-h-[88svh] w-full overflow-hidden", className)}
    >
      {imageSrc ? (
        // next/image serves a resized, compressed variant, so the huge source
        // never ships. Position is tuned so the subject sits camera-right, clear
        // of the type block. TODO(client): retune object-position to the reshoot.
        <Image
          src={imageSrc}
          alt={mediaLabel}
          fill
          priority={headingLevel === 1}
          quality={82}
          sizes="100vw"
          className="object-cover object-[62%_45%]"
        />
      ) : (
        <MediaPlaceholder label={mediaLabel} className="absolute inset-0 h-full w-full" />
      )}

      {/* Scrim — left-weighted, never a flat wash, so the image still reads. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(20,18,16,0.62) 0%, rgba(20,18,16,0.28) 38%, transparent 62%)",
        }}
      />

      {/* Bottom-left block: bottom placement means it can never collide with the
          nav at any breakpoint; the 12ch cap on the headline makes a long,
          three-line headline architecturally impossible. */}
      <div className="absolute bottom-[var(--s-8)] left-[var(--s-4)] max-w-[24ch] text-[var(--paper)] sm:left-[var(--s-5)]">
        <Heading
          id={headingId}
          className="max-w-[12ch] font-serif uppercase animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
          style={{ fontSize: "var(--step-5)", lineHeight: 1.02, letterSpacing: "-0.018em" }}
        >
          {headingLines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </Heading>

        {/* Eyebrow drops away below 480px so three words still own the frame. */}
        <p className="mt-[var(--s-3)] hidden text-[0.8125rem] uppercase tracking-[0.18em] animate-in fade-in duration-700 fill-mode-both min-[480px]:block [animation-delay:140ms]">
          {eyebrow}
        </p>

        <Link
          href={cta.href}
          className="mt-[var(--s-5)] inline-block border border-white/55 px-8 py-4 text-[0.8125rem] uppercase tracking-[0.14em] transition-colors duration-200 ease-out animate-in fade-in fill-mode-both hover:bg-[var(--paper)] hover:text-[var(--ink)] [animation-delay:260ms] [animation-duration:700ms]"
        >
          {cta.label}
        </Link>
      </div>

      {hasVideo && <HeroMediaToggle />}
    </section>
  )
}
