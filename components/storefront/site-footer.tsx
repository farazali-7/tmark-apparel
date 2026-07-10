import Link from "next/link"
import { Globe, Store } from "lucide-react"

import { SITE_CONTAINER } from "@/components/storefront/container"
import { NewsletterForm } from "@/components/storefront/newsletter-form"
import {
  COPYRIGHT,
  FOOTER_COLUMNS,
  PAYMENT_METHODS,
  SOCIAL_LINKS,
} from "@/lib/mock-data/storefront"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  return (
    <footer className="bg-brand-sage text-white">
      <div
        className={cn(
          SITE_CONTAINER,
          "py-14 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10"
        )}
      >
        <NewsletterForm />

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white/70 mb-4">
              {column.title}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/20">
        <div
          className={cn(
            SITE_CONTAINER,
            "py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          )}
        >
          <div className="flex items-center gap-6">
            <Link href="#" className="flex items-center gap-2 text-sm hover:underline">
              <Store aria-hidden className="w-4 h-4" /> Find a Boutique
            </Link>
            <Link href="#" className="flex items-center gap-2 text-sm hover:underline">
              <Globe aria-hidden className="w-4 h-4" /> International
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span id="payment-methods-label" className="text-sm text-white/80">
              Accepted payment methods:
            </span>
            <ul aria-labelledby="payment-methods-label" className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((method) => (
                <li
                  key={method.label}
                  title={method.label}
                  className="bg-white h-6 min-w-[2.25rem] px-2 rounded-sm flex items-center justify-center"
                >
                  {method.icon ? (
                    <>
                      <method.icon aria-hidden className="w-4 h-4" style={{ color: method.color }} />
                      <span className="sr-only">{method.label}</span>
                    </>
                  ) : (
                    <span className="text-brand-sage text-[9px] font-semibold tracking-wide leading-none">
                      {method.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div
          className={cn(
            SITE_CONTAINER,
            "py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          )}
        >
          <p className="text-xs text-white/70 text-center sm:text-left">{COPYRIGHT}</p>

          <ul className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <Link href={social.href} aria-label={social.label} className="hover:opacity-70">
                  <social.icon aria-hidden className="w-4 h-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
