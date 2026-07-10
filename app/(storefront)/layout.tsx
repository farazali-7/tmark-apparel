import type { Metadata } from "next"
import type { ReactNode } from "react"

import { MAIN_CONTENT_ID } from "@/components/storefront/container"
import { SiteFooter } from "@/components/storefront/site-footer"
import { SiteHeader } from "@/components/storefront/site-header"
import { SiteTopBar } from "@/components/storefront/site-top-bar"

export const metadata: Metadata = {
  title: {
    default: "Canali — Luxury Menswear",
    template: "%s — Canali",
  },
  description:
    "Canali. Italian luxury menswear, tailoring and Made to Measure.",
}

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-white font-sans">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-neutral-900 focus:shadow-md"
      >
        Skip to content
      </a>

      <SiteTopBar />
      <SiteHeader />

      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="focus:outline-none">
        {children}
      </main>

      <SiteFooter />
    </div>
  )
}
