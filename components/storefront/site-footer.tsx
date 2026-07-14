import Link from "next/link"
import { Globe, Store } from "lucide-react"

import { SITE_CONTAINER } from "@/components/storefront/container"
import { NewsletterForm } from "@/components/storefront/newsletter-form"
import { FOOTER_NAV, LEGAL_NAV, UTILITY_NAV } from "@/config/navigation"
import {
  FOOTER_TAGLINE,
  PAYMENT_METHODS_PK,
  SOCIAL_LINKS,
} from "@/content/homepage"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  return (
    <footer className="bg-brand-sage text-white">
      <div
        className={cn(
          SITE_CONTAINER,
          "py-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]"
        )}
      >
        <NewsletterForm />

        {FOOTER_NAV.map((column) => (
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
            <Link
              href={UTILITY_NAV.findStore.href}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Store aria-hidden className="w-4 h-4" /> Visit Our Store
            </Link>
            {/* TODO(client): wire to the currency selector; swaps to the
                International payment set (Visa · Mastercard · Amex · PayPal). */}
            <Link href="#" className="flex items-center gap-2 text-sm hover:underline">
              <Globe aria-hidden className="w-4 h-4" /> International
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span id="payment-methods-label" className="text-sm text-white/80">
              Accepted payment methods:
            </span>
            <ul aria-labelledby="payment-methods-label" className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS_PK.map((method) => (
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
                    <span className="text-brand-sage text-[0.5625rem] font-semibold tracking-wide leading-none whitespace-nowrap">
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
        <div className={cn(SITE_CONTAINER, "py-5 flex flex-col gap-4")}>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {LEGAL_NAV.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-white/70 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* TODO(client): [CONFIRM] full Lahore address and phone in FOOTER_TAGLINE. */}
            <p className="text-xs text-white/70 text-center sm:text-left">{FOOTER_TAGLINE}</p>

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
      </div>
    </footer>
  )
}
