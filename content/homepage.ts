import {
  SiAmericanexpress,
  SiFacebook,
  SiInstagram,
  SiMastercard,
  SiPaypal,
  SiPinterest,
  SiTiktok,
  SiVisa,
  SiX,
  SiYoutube,
} from "react-icons/si"

import type {
  CategoryTile,
  FeaturedProduct,
  HeroSlideContent,
  InfoColumn,
  PaymentMethod,
  SocialLink,
} from "@/types"

/**
 * Homepage content — every text slot as a typed object so no copy lives in JSX.
 * Voice: name the event (Barat/Nikkah/Walima), lead with proof not adjectives,
 * name the city. `[CONFIRM]` strings render verbatim and are flagged with a
 * TODO(client) — never guess a price, address, phone number or founding year.
 */

/* -------------------------------- SEO -------------------------------------- */

export const HOMEPAGE_SEO = {
  title:
    "Sherwani, Prince Coats & Bespoke Suits in Lahore | T-Mark Apparel",
  description:
    "Couture menswear tailored in Lahore. Sherwani, prince coats, ceremonial waistcoats and made-to-measure suiting for barat, nikkah and walima. Shipped worldwide.",
} as const

/* --------------------------- Announcement bar ------------------------------ */

/**
 * Static top bar. Answers the one question a buyer at this price has — lead
 * time — and offers a human (WhatsApp) rather than an account form.
 */
export const TOP_BAR = {
  leadTime: "Made-to-Measure · 4–6 weeks · Rush service for wedding dates",
} as const

/* --------------------------------- Hero ------------------------------------ */

/**
 * One hero, one CTA, one intent. The three ceremonies ARE the headline; the old
 * sentence is demoted to the eyebrow (same copy, correct hierarchy). The second
 * CTA ("Explore Sherwani") now lives as a tile in the category band below.
 */
export const HERO_SLIDES: HeroSlideContent[] = [
  {
    id: "wedding-couture",
    eyebrow: "Cut for the day you'll remember — Lahore",
    headingLines: ["Barat. Nikkah. Walima."],
    cta: { label: "Book a Fitting", href: "/made-to-measure/book" },
    imageSrc: "/DSC01322.jpg.jpeg",
    // TODO(client): alt describes the intended reshoot; update to match the real photo.
    mediaLabel:
      "Groom in an ivory and gold sherwani in a Lahore courtyard, full length in natural light",
  },
]

/* --------------------------- Category band --------------------------------- */

/**
 * Three tiles directly under the hero — the two lead garments plus Made-to-
 * Measure, which earns above-the-fold-adjacent space proportional to its margin.
 * `imageSrc` is intentionally omitted until the AVIFs exist (a missing src would
 * 404 through next/image); the placeholder renders in the meantime.
 */
export const CATEGORY_BAND: CategoryTile[] = [
  {
    label: "Sherwani",
    href: "/wedding/sherwani",
    imageSrc: "/sherwani-main-home.JPG",
    mediaLabel: "Full-length ivory sherwani with an embroidered placket",
  },
  {
    label: "Prince Coat",
    href: "/wedding/prince-coat",
    imageSrc: "/LuxuriousBlackPrinceCoatforMen_1445x.webp",
    mediaLabel: "Full-length prince coat in deep navy, three-quarter view",
  },
  {
    label: "Made to Measure",
    href: "/made-to-measure",
    imageSrc: "/MADE_TO_MEASURE_4x5.jpeg",
    mediaLabel: "Atelier detail — tailor's chalk marking cloth beside a tape measure",
  },
]

/* ------------------------------- New In ------------------------------------ */

export const NEW_IN = {
  heading: "New In",
  viewAll: { label: "View all", href: "/shop/new-in" },
  // TODO(client): replace all four `PKR [CONFIRM]` prices with real PKR figures.
  products: [
    {
      id: "ivory-raw-silk-sherwani",
      name: "Ivory raw-silk sherwani with hand-embroidered placket",
      href: "/shop/men/sherwani",
      price: "PKR [CONFIRM]",
      service: "Made-to-Measure",
      imageAlt: "Full-length ivory raw-silk sherwani with a hand-embroidered placket",
    },
    {
      id: "midnight-navy-prince-coat",
      name: "Midnight-navy wool prince coat with silk-faced lapel",
      href: "/shop/men/prince-coat",
      price: "PKR [CONFIRM]",
      service: "Ready-to-Wear",
      imageAlt: "Full-length midnight-navy wool prince coat with a silk-faced lapel",
    },
    {
      id: "antique-gold-waistcoat",
      name: "Antique-gold ceremonial waistcoat, hand-worked",
      href: "/shop/men/waistcoat",
      price: "PKR [CONFIRM]",
      service: "Ready-to-Wear",
      imageAlt: "Antique-gold ceremonial waistcoat with hand-worked embroidery",
    },
    {
      id: "charcoal-three-piece-suit",
      name: "Charcoal three-piece suit in Super 120s wool",
      href: "/shop/men/western-suiting",
      price: "PKR [CONFIRM]",
      service: "Made-to-Measure",
      imageAlt: "Full-length charcoal three-piece suit in Super 120s wool",
    },
  ] satisfies FeaturedProduct[],
} as const

/* --------------------------- Three-column band ----------------------------- */

export const INFO_COLUMNS: InfoColumn[] = [
  {
    title: "Visit Our Store",
    // TODO(client): fill the [CONFIRM] opening days/hours and full Lahore address.
    body: "See the cloth, feel the weight, be measured properly. Our Lahore atelier is open [CONFIRM: days, hours], at [CONFIRM: full address].",
    links: [
      { label: "Find Our Store", href: "/stores" },
      { label: "Book a Consultation", href: "/made-to-measure/book" },
    ],
  },
  {
    title: "Made-to-Measure",
    body: "Twenty-two measurements. Your choice of cloth. Two fittings, in Lahore or by video if you're abroad. Four to six weeks from first fitting to finished garment.",
    links: [{ label: "Book a Fitting", href: "/made-to-measure/book" }],
  },
  {
    title: "Craftsmanship",
    // TODO(client): replace [CONFIRM: real founding year] with the true year.
    body: "Every garment is cut by hand, embroidered by hand, and inspected before it leaves the atelier. Tailoring in Lahore since [CONFIRM: real founding year].",
    links: [{ label: "See how it's made", href: "/brand/craftsmanship" }],
  },
]

/* ------------------------------ Newsletter --------------------------------- */

export const NEWSLETTER = {
  heading: "Join the House",
  body: "New collections, wedding-season openings, and fitting appointments — before they're public.",
  emailLabel: "Email address",
  consentLead: "I agree to receive emails from T-Mark Apparel. Unsubscribe any time. See our ",
  consentLinkLabel: "Privacy Policy",
  consentTrail: ".",
  privacyHref: "#",
  submitLabel: "Subscribe",
} as const

/* -------------------------- Footer chrome & payments ----------------------- */

/**
 * Pakistan set renders by default; the International set swaps in on currency
 * selection (wiring pending). Methods without a simple-icons glyph render as a
 * text pill via the PaymentMethod union.
 */
export const PAYMENT_METHODS_PK: PaymentMethod[] = [
  { label: "Visa", icon: SiVisa, color: "#1A1F71" },
  { label: "Mastercard", icon: SiMastercard, color: "#EB001B" },
  { label: "JazzCash" },
  { label: "Easypaisa" },
  { label: "Bank Transfer" },
  // TODO(client): confirm Cash on Delivery is offered.
  { label: "Cash on Delivery" },
]

export const PAYMENT_METHODS_INTL: PaymentMethod[] = [
  { label: "Visa", icon: SiVisa, color: "#1A1F71" },
  { label: "Mastercard", icon: SiMastercard, color: "#EB001B" },
  { label: "Amex", icon: SiAmericanexpress, color: "#006FCF" },
  // TODO(client): confirm PayPal is live for international orders.
  { label: "PayPal", icon: SiPaypal, color: "#00457C" },
]

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "#", icon: SiFacebook },
  { label: "X", href: "#", icon: SiX },
  { label: "Instagram", href: "#", icon: SiInstagram },
  { label: "TikTok", href: "#", icon: SiTiktok },
  { label: "Pinterest", href: "#", icon: SiPinterest },
  { label: "Youtube", href: "#", icon: SiYoutube },
]

/**
 * Footer baseline. Address and phone are [CONFIRM] and render verbatim.
 */
// TODO(client): supply the full Lahore address and phone number for the footer line.
export const FOOTER_TAGLINE =
  "T-Mark Apparel · [CONFIRM: full Lahore address] · [CONFIRM: phone] · Shipping worldwide"
