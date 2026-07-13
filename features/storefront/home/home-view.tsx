import { FeaturedProducts } from "@/features/storefront/home/components/featured-products"
import { HeroSlide } from "@/features/storefront/home/components/hero-slide"
import { InfoColumns } from "@/features/storefront/home/components/info-columns"
import { TileRow } from "@/features/storefront/home/components/tile-row"
import { HERO_SLIDES, SHOP_BY_GARMENT } from "@/content/homepage"

export function HomeView() {
  return (
    <>
      {HERO_SLIDES.map((slide, index) => (
        <HeroSlide
          key={slide.id}
          content={slide}
          headingLevel={index === 0 ? 1 : 2}
          className={index > 0 ? "mt-3.5" : undefined}
        />
      ))}

      <TileRow tiles={SHOP_BY_GARMENT.tiles} heading={SHOP_BY_GARMENT.heading} showLabels />
      <FeaturedProducts />
      <InfoColumns />
    </>
  )
}
