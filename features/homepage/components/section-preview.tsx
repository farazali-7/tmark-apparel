import { Camera, Mail, Ruler, Star } from "lucide-react"

import { CampaignCover } from "@/components/shared/campaign-cover"
import { ProductThumb } from "@/components/shared/product-thumb"
import { CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { HomepageSection, SectionSettings } from "@/types"

function bg(settings: SectionSettings): string {
  switch (settings.background) {
    case "muted":
      return "bg-muted/40"
    case "ink":
      return "bg-foreground text-background"
    default:
      return "bg-background"
  }
}
function pad(settings: SectionSettings): string {
  switch (settings.spacing) {
    case "tight":
      return "py-4"
    case "spacious":
      return "py-10"
    default:
      return "py-7"
  }
}
const HERO_HEIGHT = { compact: "h-40", medium: "h-52", tall: "h-64" } as const
const PRODUCTS = [
  { name: "Ivory Sherwani", seed: "ivory", price: "PKR 42,000" },
  { name: "Navy Suit", seed: "navy", price: "PKR 46,500" },
  { name: "Charcoal Waistcoat", seed: "charcoal", price: "PKR 8,900" },
  { name: "Emerald Kurta", seed: "emerald", price: "PKR 10,400" },
  { name: "Maroon Sherwani", seed: "maroon", price: "PKR 72,000" },
  { name: "Sand Shalwar", seed: "sand", price: "PKR 15,600" },
  { name: "Black Prince Coat", seed: "black", price: "PKR 58,000" },
  { name: "Ivory Kurta", seed: "ivory", price: "PKR 9,800" },
]
const TESTIMONIALS = [
  { name: "Ahsan R.", quote: "Impeccable stitching and a flawless fit.", initials: "AR" },
  { name: "Imran Y.", quote: "My ninth order — they never miss.", initials: "IY" },
  { name: "Omar F.", quote: "Shipped to Dubai in four days, beautifully packed.", initials: "OF" },
]

function Heading({ children, ink }: { children: React.ReactNode; ink?: boolean }) {
  return (
    <h3 className={cn("mb-4 text-center font-display text-lg font-medium", ink && "text-background")}>
      {children}
    </h3>
  )
}

export function SectionPreview({ section }: { section: HomepageSection }) {
  const s = section.settings

  switch (section.type) {
    case "hero":
      return (
        <div className={cn("relative w-full overflow-hidden", HERO_HEIGHT[s.height ?? "medium"])}>
          <CampaignCover seed={s.cover ?? "wedding"} className="absolute inset-0 size-full" />
          {s.overlay && s.overlay !== "none" ? (
            <div
              className={cn(
                "absolute inset-0",
                s.overlay === "light" && "bg-black/20",
                s.overlay === "medium" && "bg-black/40",
                s.overlay === "dark" && "bg-black/60"
              )}
            />
          ) : null}
          <div
            className={cn(
              "relative flex size-full flex-col justify-center gap-2 p-6 text-white",
              s.alignment === "center" && "items-center text-center",
              s.alignment === "right" && "items-end text-right"
            )}
          >
            {s.subtitle ? (
              <span className="max-w-md text-[0.65rem] font-medium tracking-[0.16em] text-white/75 uppercase">
                {s.subtitle}
              </span>
            ) : null}
            <h2 className="max-w-lg font-display text-2xl leading-tight font-medium sm:text-3xl">
              {s.title}
            </h2>
            {s.cta ? (
              <span
                className={cn(
                  "mt-2 inline-flex w-fit items-center rounded-full px-4 py-1.5 text-xs font-medium",
                  s.buttonStyle === "outline"
                    ? "border border-white text-white"
                    : s.buttonStyle === "minimal"
                      ? "text-white underline underline-offset-4"
                      : "bg-white text-black"
                )}
              >
                {s.cta}
              </span>
            ) : null}
          </div>
        </div>
      )

    case "featured_categories":
      return (
        <div className={cn(bg(s), pad(s), "px-6")}>
          <Heading ink={s.background === "ink"}>{s.title}</Heading>
          <div className={cn("grid gap-3", s.columns === 4 ? "grid-cols-4" : s.columns === 2 ? "grid-cols-2" : "grid-cols-3")}>
            {CATEGORIES.slice(0, s.columns === 2 ? 2 : s.columns === 4 ? 4 : 3).map((cat, i) => (
              <div key={cat} className="space-y-1.5">
                <CampaignCover seed={["velvet", "premium", "editor", "winter"][i % 4]} className="aspect-[4/5] w-full rounded-lg" label={cat} wordmarkClassName="text-sm -bottom-1" />
                <p className="text-center text-xs font-medium">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case "featured_collections":
      return (
        <div className={cn(bg(s), pad(s), "px-6")}>
          <Heading ink={s.background === "ink"}>{s.title}</Heading>
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: Math.min(s.itemCount ?? 4, 4) }).map((_, i) => (
              <div key={i} className="min-w-0 flex-1">
                <CampaignCover seed={["wedding", "summer", "bestsellers", "festive"][i % 4]} className="aspect-[3/4] w-full rounded-lg" />
              </div>
            ))}
          </div>
          {s.cta ? (
            <p className="mt-4 text-center text-xs font-medium underline underline-offset-4">{s.cta}</p>
          ) : null}
        </div>
      )

    case "featured_products":
      return (
        <div className={cn(bg(s), pad(s), "px-6")}>
          <Heading ink={s.background === "ink"}>{s.title}</Heading>
          <div className={cn("grid gap-3", (s.itemCount ?? 4) >= 6 ? "grid-cols-4" : "grid-cols-4")}>
            {PRODUCTS.slice(0, s.itemCount ?? 4).map((p, i) => (
              <div key={i} className="space-y-1.5">
                <ProductThumb seed={p.seed} name={p.name} className="aspect-[3/4] w-full" iconClassName="size-6" />
                <p className="truncate text-[0.7rem] font-medium">{p.name}</p>
                <p className="text-[0.65rem] text-muted-foreground tabular">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case "brand_story":
      return (
        <div className={cn(bg(s), pad(s), "px-6")}>
          <div className={cn("flex items-center gap-5", s.alignment === "right" && "flex-row-reverse")}>
            <CampaignCover seed={s.cover ?? "editor"} className="aspect-[4/3] w-2/5 rounded-lg" />
            <div className="flex-1 space-y-2">
              <h3 className="font-display text-xl font-medium">{s.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{s.subtitle}</p>
              <span className="inline-block text-xs font-medium underline underline-offset-4">Read our story</span>
            </div>
          </div>
        </div>
      )

    case "custom_tailoring":
      return (
        <div className={cn(bg(s), pad(s), "px-6")}>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className={cn("flex size-9 items-center justify-center rounded-full", s.background === "ink" ? "bg-background/15 text-background" : "bg-muted text-muted-foreground")}>
              <Ruler className="size-4" />
            </span>
            <h3 className={cn("font-display text-xl font-medium", s.background === "ink" && "text-background")}>{s.title}</h3>
            <p className={cn("max-w-md text-xs leading-relaxed", s.background === "ink" ? "text-background/70" : "text-muted-foreground")}>{s.subtitle}</p>
            {s.cta ? (
              <span className={cn("mt-1 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium", s.background === "ink" ? "bg-background text-foreground" : "bg-foreground text-background")}>
                {s.cta}
              </span>
            ) : null}
          </div>
        </div>
      )

    case "testimonials":
      return (
        <div className={cn(bg(s), pad(s), "px-6")}>
          <Heading ink={s.background === "ink"}>{s.title}</Heading>
          <div className="grid grid-cols-3 gap-3">
            {TESTIMONIALS.slice(0, Math.min(s.itemCount ?? 3, 3)).map((t) => (
              <div key={t.name} className="rounded-lg border bg-background p-3">
                <div className="mb-1.5 flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-current" />
                  ))}
                </div>
                <p className="text-[0.7rem] leading-relaxed text-muted-foreground">“{t.quote}”</p>
                <p className="mt-2 text-[0.7rem] font-medium">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case "instagram":
      return (
        <div className={cn(bg(s), pad(s), "px-6")}>
          <div className="mb-3 flex items-center justify-center gap-1.5 text-sm font-medium">
            <Camera className="size-4" /> {s.handle ?? "@tmarkapparel"}
          </div>
          <div className={cn("grid gap-1.5", s.columns === 3 ? "grid-cols-3" : s.columns === 2 ? "grid-cols-2" : "grid-cols-4")}>
            {Array.from({ length: (s.columns ?? 4) * 1 }).map((_, i) => (
              <CampaignCover key={i} seed={["velvet", "premium", "editor", "wedding"][i % 4]} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>
      )

    case "newsletter":
      return (
        <div className={cn(bg(s), pad(s), "px-6")}>
          <div className={cn("flex flex-col gap-2", s.alignment === "left" ? "items-start" : s.alignment === "right" ? "items-end" : "items-center text-center")}>
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Mail className="size-4" />
            </span>
            <h3 className="font-display text-lg font-medium">{s.title}</h3>
            <p className="max-w-sm text-xs text-muted-foreground">{s.subtitle}</p>
            <div className="mt-1 flex w-full max-w-sm items-center gap-1.5">
              <span className="h-8 flex-1 rounded-md border bg-background" />
              <span className="flex h-8 items-center rounded-md bg-foreground px-3 text-xs font-medium text-background">
                {s.cta ?? "Subscribe"}
              </span>
            </div>
          </div>
        </div>
      )

    case "footer":
      return (
        <div className={cn(bg(s), "px-6 py-8")}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-display text-base font-medium text-background">T-Mark Apparel</p>
              <p className="text-[0.7rem] text-background/60">{s.title}</p>
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-[0.7rem] text-background/70">
              {["Shop", "Collections", "Tailoring", "About", "Contact", "Shipping"].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}
