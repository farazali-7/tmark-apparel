import Link from "next/link"

import { SITE_CONTAINER } from "@/components/storefront/container"
import { MediaPlaceholder } from "@/components/storefront/media-placeholder"
import { NEW_IN } from "@/content/homepage"
import { cn } from "@/lib/utils"

const HEADING_ID = "new-in-heading"

export function FeaturedProducts() {
  return (
    <section aria-labelledby={HEADING_ID} className={cn(SITE_CONTAINER, "py-16 sm:py-20")}>
      {/* Centred heading with a right-aligned "View all" that drops below on mobile. */}
      <div className="relative mb-10">
        <h2
          id={HEADING_ID}
          className="font-serif uppercase text-3xl sm:text-4xl text-center text-neutral-900 tracking-wide"
        >
          {NEW_IN.heading}
        </h2>
        <Link
          href={NEW_IN.viewAll.href}
          className="mt-3 block text-center text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-950 sm:absolute sm:right-0 sm:bottom-1 sm:mt-0 sm:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2"
        >
          {NEW_IN.viewAll.label}
        </Link>
      </div>

      {/* The hairline grid is drawn by the parent's background bleeding through
          a 1px gap; both collapse at sm where the cards sit on white. */}
      <ul className="mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 sm:gap-0 sm:bg-transparent">
        {NEW_IN.products.map((product) => (
          <li key={product.id} className="group bg-white">
            <Link
              href={product.href}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-800"
            >
              {/* Full-length garments demand a vertical crop — portrait 3:4. */}
              <div className="overflow-hidden">
                <MediaPlaceholder
                  label={product.imageAlt}
                  className="aspect-[3/4] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-sm text-neutral-800 leading-snug pr-3 transition-colors group-hover:text-neutral-950">
                {product.name}
              </p>
              {/* TODO(client): price renders the verbatim `PKR [CONFIRM]` placeholder. */}
              <p className="mt-1 text-sm text-neutral-600 tabular pr-3">{product.price}</p>
              <span
                className={cn(
                  "mt-2 inline-block text-[0.6875rem] tracking-[0.15em] uppercase",
                  product.service === "Made-to-Measure"
                    ? "text-gold"
                    : "text-neutral-500"
                )}
              >
                {product.service}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
