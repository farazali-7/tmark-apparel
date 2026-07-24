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
   * When present, this top-level item opens an editorial mega menu — a five-zone
   * "showroom" organised by how the customer thinks (occasion first), not by our
   * internal page tree.
   */
  megaMenu?: MegaMenu
}

/** A mega-menu link, optionally enriched for the editorial layout. */
export interface MegaLink extends NavItem {
  /** One-line preview shown beneath a garment. */
  description?: string
  /** Subtle merchandising badge, e.g. "New" / "Limited". */
  badge?: string
  /** Portrait that swaps into the editorial panel while this link is hovered. */
  imageSrc?: string
  imageAlt?: string
}

/** A titled column of links. */
export interface MegaGroup {
  heading: string
  links: MegaLink[]
  /** Optional "view all" link rendered under the list. */
  footer?: NavItem
}

/** The wide editorial panel — the emotional centre of the menu. */
export interface MegaEditorial {
  imageSrc?: string
  imageAlt: string
  caption: string
  cta: NavItem
}

/**
 * Five zones: Occasions (journey) → Garments → Collections → Editorial →
 * Experience, with a reassurance strip along the bottom. Seasonal merchandising
 * swaps the `collections` group without touching navigation structure.
 */
export interface MegaMenu {
  occasions: MegaGroup
  garments: MegaGroup
  collections: MegaGroup
  editorial: MegaEditorial
  experience: MegaGroup
  /** The tailor's note — craft in the first person, sat beside the reassurances. */
  note?: string
  trust: string[]
}

/**
 * The Wedding menu. Occasions lead because that is how a groom thinks ("my barat
 * is in three months"), not "I need a sherwani". Garments carry one-line previews;
 * collections carry subtle badges; the editorial panel sells the moment, not the
 * cloth; the experience column surfaces the consultation-first conversion points.
 *
 * TODO(client): collection names, the perfect-fit / imported-fabric promises and
 * the editorial copy are placeholders — confirm the real merchandising before
 * launch. Occasion/garment routes 404 until their pages exist (Stage 2–4).
 */
const WEDDING_MENU: MegaMenu = {
  occasions: {
    heading: "By Occasion",
    links: [
      { label: "Barat", href: "/wedding/barat" },
      { label: "Nikkah", href: "/wedding/nikkah" },
      { label: "Walima", href: "/wedding/walima" },
      { label: "Mehndi", href: "/wedding/mehndi" },
      { label: "Reception", href: "/wedding/reception" },
      { label: "Engagement", href: "/wedding/engagement" },
    ],
    footer: { label: "View the Wedding Guide", href: "/wedding" },
  },
  garments: {
    heading: "By Garment",
    links: [
      {
        label: "Sherwani",
        href: "/wedding/sherwani",
        description: "Hand-embroidered ceremonial elegance.",
        imageSrc: "/sherwani-main-home.JPG",
        imageAlt: "Full-length ivory sherwani with an embroidered placket",
      },
      {
        label: "Prince Coat",
        href: "/wedding/prince-coat",
        description: "Sharp, structured formal tailoring.",
        imageSrc: "/LuxuriousBlackPrinceCoatforMen_1445x.webp",
        imageAlt: "Full-length prince coat in deep black, three-quarter view",
      },
      {
        label: "Tuxedo",
        href: "/wedding/tuxedo",
        description: "Black-tie, cut to measure.",
      },
      {
        label: "Waistcoat",
        href: "/wedding/waistcoat",
        description: "Ceremonial layering pieces.",
      },
      {
        label: "Kurta",
        href: "/wedding/kurta",
        description: "Lightweight, for mehndi and day events.",
      },
    ],
  },
  collections: {
    // TODO(client): confirm real collection names, seasonality and routes.
    heading: "Collections",
    links: [
      { label: "Signature", href: "/shop/collections/signature" },
      { label: "Royal Heritage", href: "/shop/collections/royal-heritage" },
      { label: "Italian Wool", href: "/shop/collections/italian-wool" },
      { label: "New Arrivals", href: "/shop/new-in", badge: "New" },
      { label: "Wedding Capsule", href: "/shop/collections/wedding-capsule", badge: "Limited" },
    ],
  },
  editorial: {
    imageSrc: "/DSC01322.jpg.jpeg",
    // TODO(client): update alt to the real reshoot.
    imageAlt: "Groom in a ceremonial sherwani in soft evening light, full length",
    // TODO(client): confirm editorial copy.
    caption: "Crafted for the moments you'll remember for a lifetime.",
    cta: { label: "Reserve a Private Fitting", href: "/made-to-measure/book" },
  },
  experience: {
    heading: "Experience",
    links: [
      { label: "Reserve a Fitting", href: "/made-to-measure/book" },
      { label: "Style Guide", href: "/brand/lookbook" },
      { label: "Size Guide", href: "/help/size-guide" },
      // TODO(client): replace with the real wa.me number.
      { label: "WhatsApp", href: "https://wa.me/92XXXXXXXXXX" },
      { label: "Private Consultation", href: "/made-to-measure/book" },
    ],
  },
  // Consistent with the craftsmanship claim already made on the homepage.
  note: "Every garment is cut, embroidered and finished by hand in our Lahore atelier.",
  // TODO(client): confirm these promises are ones the brand can stand behind.
  trust: [
    "Handcrafted in Lahore",
    "Imported fabrics",
    "Perfect-fit guarantee",
    "Worldwide shipping",
  ],
}

/**
 * Primary navbar. Order is deliberate — Wedding and Made to Measure (the
 * highest-margin intents) lead. Wedding opens the occasion mega menu; the rest
 * are direct links. Children on Men are modelled for a future landing page.
 */
export const MAIN_NAV: NavItem[] = [
  { label: "Wedding", href: "/wedding", megaMenu: WEDDING_MENU },
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
  // A trust signal, not a place name — it says what we do, not where we are.
  atelier: { label: "Handcrafted in Lahore", href: "/atelier" },
  madeToMeasure: { label: "Learn more", href: "/made-to-measure" },
  // TODO(client): replace with the real wa.me number, e.g. https://wa.me/92XXXXXXXXXX
  whatsapp: { label: "WhatsApp", href: "https://wa.me/92XXXXXXXXXX" },
  findStore: { label: "Find a Store", href: "/stores" },
  signIn: { label: "Sign In", href: "/account" },
  createAccount: { label: "Create Account", href: "/account?tab=signup" },
  // Header utilities. The single primary CTA — consultation before commerce.
  // "Reserve" (not "Book Now") is the house verb: it implies something held for
  // you rather than a transaction completed. Used verbatim everywhere.
  account: { label: "Account", href: "/account" },
  bookAppointment: { label: "Reserve a Fitting", href: "/made-to-measure/book" },
  // TODO(client): the search results page (/search) is not built yet — the
  // overlay routes here on submit so the control is real, not decorative.
  search: { label: "Search", href: "/search" },
} satisfies Record<string, NavItem>

/**
 * Shown the moment search opens, so the field is never a dead empty box. These
 * are the highest-intent entry points, not a search history.
 * TODO(client): confirm against real search analytics once traffic exists.
 */
export const POPULAR_SEARCHES: NavItem[] = [
  { label: "Sherwani", href: "/wedding/sherwani" },
  { label: "Prince Coat", href: "/wedding/prince-coat" },
  { label: "Tuxedo", href: "/wedding/tuxedo" },
  { label: "Waistcoat", href: "/wedding/waistcoat" },
  { label: "Made to Measure", href: "/made-to-measure" },
]

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
