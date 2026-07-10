import Link from "next/link"

import { SITE_CONTAINER } from "@/components/storefront/container"
import { MediaPlaceholder } from "@/components/storefront/media-placeholder"
import { INFO_COLUMNS } from "@/lib/mock-data/storefront"
import { cn } from "@/lib/utils"

export function InfoColumns() {
  return (
    <section aria-label="Discover Canali" className="bg-brand-sand">
      <div
        className={cn(
          SITE_CONTAINER,
          "py-16 sm:py-20 grid grid-cols-1 md:grid-cols-3 gap-10"
        )}
      >
        {INFO_COLUMNS.map((column) => (
          <article key={column.title}>
            <h3 className="font-serif uppercase text-3xl text-neutral-900 tracking-wide mb-6">
              {column.title}
            </h3>
            <MediaPlaceholder label={column.title} className="aspect-[4/3] w-full mb-6" />
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">{column.body}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
