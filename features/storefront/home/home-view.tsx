import { FeaturedProducts } from "@/features/storefront/home/components/featured-products"
import { HeroSlide } from "@/features/storefront/home/components/hero-slide"
import { InfoColumns } from "@/features/storefront/home/components/info-columns"
import { TileRow } from "@/features/storefront/home/components/tile-row"
import { CATEGORY_BAND, HERO_SLIDES } from "@/content/homepage"

export function HomeView() {
  return (
    <div>
      {HERO_SLIDES.map((slide, index) => (
        <HeroSlide key={slide.id} content={slide} headingLevel={index === 0 ? 1 : 2} />
      ))}

      {/* Category band sits just under the hero — small 20px gap. */}
      <div className="mt-[35px]">
        <TileRow tiles={CATEGORY_BAND} ariaLabel="Shop by garment" />
      </div>
      <div className="mt-[100px]">
        <FeaturedProducts />
      </div>
      <div className="mt-[100px]">
        <InfoColumns />
      </div>
    </div>
  )
}
