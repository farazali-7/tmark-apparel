import type { Metadata } from "next"

import { HOMEPAGE_SEO } from "@/content/homepage"
import { HomeView } from "@/features/storefront/home/home-view"

export const metadata: Metadata = {
  // `absolute` bypasses the layout's "%s — T-Mark Apparel" template; the deck
  // title is already fully branded.
  title: { absolute: HOMEPAGE_SEO.title },
  description: HOMEPAGE_SEO.description,
}

// TODO(client): confirm the canonical production domain.
const SITE_URL = "https://www.tmarkapparel.com"

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "T-Mark Apparel",
  description: HOMEPAGE_SEO.description,
  url: SITE_URL,
  // TODO(client): add logo, sameAs (social profiles), address and telephone
  // once the real values are confirmed — do not invent them.
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <HomeView />
    </>
  )
}
