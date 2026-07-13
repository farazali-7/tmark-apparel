import { SITE_CONTAINER } from "@/components/storefront/container"
import { MediaPlaceholder } from "@/components/storefront/media-placeholder"
import { FEATURED_PRODUCTS } from "@/lib/mock-data/storefront"
import { cn } from "@/lib/utils"

const HEADING_ID = "featured-heading"

export function FeaturedProducts() {
  return (
    <section aria-labelledby={HEADING_ID} className={cn(SITE_CONTAINER, "py-16 sm:py-20")}>
      <h2
        id={HEADING_ID}
        className="font-serif uppercase text-3xl sm:text-4xl text-center text-neutral-900 tracking-wide mb-10"
      >
        Featured
      </h2>

      {/* The hairline grid is drawn by the parent's background bleeding through
          a 1px gap; both collapse at sm where the cards sit on white. */}
      <ul className="mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 sm:gap-0 sm:bg-transparent">
        {FEATURED_PRODUCTS.map((product) => (
          <li key={product.id} className="group bg-white">
            <div className="overflow-hidden">
              <MediaPlaceholder
                label={product.name}
                className="aspect-[3/4] w-full transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <p className="mt-3 text-sm text-neutral-700 leading-snug pr-3 transition-colors group-hover:text-neutral-950">
              {product.name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
