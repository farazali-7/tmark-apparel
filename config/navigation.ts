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
  /**
   * When present, this top-level item opens a mega menu organised by occasion.
   * The buyer shops by event (Barat/Nikkah/Walima/Mehndi), not by garment.
   */
  mega?: MegaColumn[]
}

/** One occasion column in the Wedding mega menu. */
export interface MegaColumn {
  /** Occasion heading, itself a link to the occasion edit. */
  occasion: NavItem
  /** Garments cut for that occasion. */
  links: NavItem[]
}

/**
 * Wedding is organised by occasion, mirroring the hero's own headline. Order and
 * pairings come straight from the merchandising brief.
 */
const WEDDING_MEGA: MegaColumn[] = [
  {
    occasion: { label: "Barat", href: "/wedding/barat" },
    links: [
      { label: "Sherwani", href: "/wedding/sherwani" },
      { label: "Prince Coat", href: "/wedding/prince-coat" },
    ],
  },
  {
    occasion: { label: "Nikkah", href: "/wedding/nikkah" },
    links: [
      { label: "Prince Coat", href: "/wedding/prince-coat" },
      { label: "Waistcoat", href: "/wedding/waistcoat" },
    ],
  },
  {
    occasion: { label: "Walima", href: "/wedding/walima" },
    links: [
      { label: "Suiting", href: "/wedding/suiting" },
      { label: "Tuxedo", href: "/wedding/tuxedo" },
    ],
  },
  {
    occasion: { label: "Mehndi", href: "/wedding/mehndi" },
    links: [
      { label: "Kurta", href: "/wedding/kurta" },
      { label: "Shawl", href: "/wedding/shawl" },
    ],
  },
]

/**
 * Primary navbar. Order is deliberate — Wedding and Made to Measure (the
 * highest-margin intents) lead. Wedding opens the occasion mega menu; the rest
 * are direct links. Children on Men are modelled for a future landing page.
 */
export const MAIN_NAV: NavItem[] = [
  { label: "Wedding", href: "/wedding", mega: WEDDING_MEGA },
  { label: "Made to Measure", href: "/made-to-measure" },
  {
    // Ready-to-Wear is the entry to the SINGLE catalogue (RTW is a product
    // attribute — see the file header). It replaces the old "Men" label so the
    // nav reads by intent, not gender; Kids lives inside the same tree as a
    // child rather than a parallel top-level shout.
    label: "Ready to Wear",
    href: "/shop",
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
      // TODO(client): confirm the Kids garment tree (full tree, or Sherwani + Waistcoat only).
      { label: "Kids", href: "/shop/kids" },
    ],
  },
  { label: "New In", href: "/shop/new-in" },
  { label: "Our Brand", href: "/brand" },
]

/** Top-bar and utility links. */
export const UTILITY_NAV = {
  atelier: { label: "Lahore Atelier", href: "/atelier" },
  madeToMeasure: { label: "Learn more", href: "/made-to-measure" },
  // TODO(client): replace with the real wa.me number, e.g. https://wa.me/92XXXXXXXXXX
  whatsapp: { label: "WhatsApp", href: "https://wa.me/92XXXXXXXXXX" },
  findStore: { label: "Find a Store", href: "/stores" },
  signIn: { label: "Sign In", href: "/account" },
  createAccount: { label: "Create Account", href: "/account?tab=signup" },
  // Header utilities. The single primary CTA — consultation before commerce.
  account: { label: "Account", href: "/account" },
  bookAppointment: { label: "Book Appointment", href: "/made-to-measure/book" },
  // TODO(client): the search results page (/search) is not built yet — the
  // overlay routes here on submit so the control is real, not decorative.
  search: { label: "Search", href: "/search" },
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
