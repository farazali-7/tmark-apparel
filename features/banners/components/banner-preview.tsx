import { CampaignCover } from "@/components/shared/campaign-cover"
import { cn } from "@/lib/utils"

/**
 * The banner exactly as a shopper would see it — a duotone campaign cover with
 * headline, subtitle and CTA. Shared by the campaign cards and the live
 * preview in the create drawer, so what you edit is what ships.
 */
export function BannerPreview({
  cover,
  headline,
  subtitle,
  cta,
  align = "left",
  className,
  compact = false,
}: {
  cover: string
  headline: string
  subtitle?: string
  cta?: string
  align?: "left" | "center" | "right"
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <CampaignCover seed={cover} className="absolute inset-0 size-full" />
      <div
        className={cn(
          "relative flex size-full flex-col justify-end gap-1.5 p-4 text-white sm:gap-2 sm:p-6",
          align === "center" && "items-center text-center",
          align === "right" && "items-end text-right",
          compact && "p-3 sm:p-4"
        )}
      >
        {subtitle ? (
          <span
            className={cn(
              "text-[0.65rem] font-medium tracking-[0.16em] text-white/75 uppercase",
              compact && "text-[0.6rem]"
            )}
          >
            {subtitle}
          </span>
        ) : null}
        <h3
          className={cn(
            "max-w-lg font-display leading-tight font-medium",
            compact ? "text-lg" : "text-2xl sm:text-3xl"
          )}
        >
          {headline}
        </h3>
        {cta ? (
          <span
            className={cn(
              "mt-1 inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-black",
              compact && "mt-0.5 px-2.5 py-0.5 text-[0.7rem]"
            )}
          >
            {cta}
          </span>
        ) : null}
      </div>
    </div>
  )
}
