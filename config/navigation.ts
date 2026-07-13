/**
 * Navigation — the single source of truth for every storefront link.
 *
 * No href may be hardcoded in JSX; components read from here. Taxonomy depth is
 * capped at 3. Crucially, Ready-to-Wear vs Made-to-Measure is a product
 * ATTRIBUTE (see `ProductService`), never a URL folder: there is exactly one
 * category tree, and `/made-to-measure` is a service landing page, not a
 * parallel catalogue.
 */

export interface NavItem {
  label: string
  href: string
  /** Sub-navigation, max two levels deep (this node + children + grandchildren). */
  children?: NavItem[]
}

/**
 * Primary navbar. Rendered flat today (top level only) to preserve the approved
 * header layout; children are modelled here so a mega menu or category landing
 * page can consume them later without touching component code.
 */
export const MAIN_NAV: NavItem[] = [
  { label: "New In", href: "/shop/new-in" },
  {
    label: "Men",
    href: "/shop/men",
    children: [
      { label: "Sherwani", href: "/shop/men/sherwani" },
      { label: "Prince Coat", href: "/shop/men/prince-coat" },
      // TODO(client): confirm Waistcoat sub-categories (Classic / Ceremonial)
      // before adding a third taxonomy level here.
      { label: "Waistcoat", href: "/shop/men/waistcoat" },
      { label: "Shalwar Kameez", href: "/shop/men/shalwar-kameez" },
      // TODO(client): confirm Western Suiting sub-types (Two Piece / Three Piece /
      // Double Breasted / Tuxedo) before nesting them here.
      { label: "Western Suiting", href: "/shop/men/western-suiting" },
    ],
  },
  // TODO(client): confirm the Kids garment tree (full tree, or Sherwani + Waistcoat only).
  { label: "Kids", href: "/shop/kids" },
  { label: "Wedding", href: "/shop/occasion/barat" },
  { label: "Made to Measure", href: "/made-to-measure" },
  { label: "Our Brand", href: "/brand" },
]

/** Top-bar utility links. */
export const UTILITY_NAV = {
  findStore: { label: "Find a Store", href: "/stores" },
  signIn: { label: "Sign In", href: "/account" },
  createAccount: { label: "Create Account", href: "/account?tab=signup" },
} satisfies Record<string, NavItem>

/** Footer link columns (Legal lives in the bottom bar — see LEGAL_NAV). */
export const FOOTER_NAV: { title: string; links: NavItem[] }[] = [
  {
    title: "About T-Mark Apparel",
    links: [
      { label: "Our Story", href: "/brand/story" },
      { label: "Craftsmanship", href: "/brand/craftsmanship" },
      { label: "The Lahore Atelier", href: "/brand/atelier" },
      { label: "Lookbook", href: "/brand/lookbook" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "New In", href: "/shop/new-in" },
      { label: "Sherwani", href: "/shop/men/sherwani" },
      { label: "Prince Coat", href: "/shop/men/prince-coat" },
      { label: "Waistcoat", href: "/shop/men/waistcoat" },
      { label: "Shalwar Kameez", href: "/shop/men/shalwar-kameez" },
      { label: "Western Suiting", href: "/shop/men/western-suiting" },
      { label: "Kids", href: "/shop/kids" },
    ],
  },
  {
    title: "Made-to-Measure",
    links: [
      { label: "How It Works", href: "/made-to-measure" },
      { label: "Book a Fitting", href: "/made-to-measure/book" },
      { label: "Fabric Library", href: "/made-to-measure/fabrics" },
      { label: "Measurement Guide", href: "/made-to-measure/measurements" },
      { label: "Ordering from Abroad", href: "/made-to-measure/remote" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      // TODO(client): replace with the real wa.me number, e.g. https://wa.me/92XXXXXXXXXX
      { label: "WhatsApp", href: "#" },
      { label: "Size Guide", href: "/help/size-guide" },
      { label: "Shipping & Returns", href: "/help/shipping" },
      { label: "Alterations", href: "/help/alterations" },
      { label: "FAQ", href: "/help/faq" },
    ],
  },
]

/**
 * Legal links. The deck lists the labels without targets, so hrefs stay as "#"
 * placeholders rather than invented paths.
 */
export const LEGAL_NAV: NavItem[] = [
  // TODO(client): confirm real Legal link targets.
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Accessibility", href: "#" },
]
