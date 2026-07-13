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
  Announcement,
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

export const ANNOUNCEMENTS: Announcement[] = [
  [{ text: "Worldwide shipping — Pakistan, UK, USA, Gulf & Canada", href: "/help/shipping" }],
  [{ text: "Made-to-Measure fittings now booking in Lahore", href: "/made-to-measure/book" }],
  [{ text: "Wedding season 2026 — order 6 weeks before your event", href: "/shop/occasion/barat" }],
]

/* --------------------------------- Hero ------------------------------------ */

export const HERO_SLIDES: HeroSlideContent[] = [
  {
    id: "wedding-couture",
    eyebrow: "COUTURE MENSWEAR — LAHORE",
    headingLines: ["Barat. Nikkah. Walima.", "Cut for the day you'll remember."],
    cta: { label: "BOOK A FITTING", href: "/made-to-measure/book" },
    secondaryCta: { label: "EXPLORE SHERWANI", href: "/shop/men/sherwani" },
    imageSrc: "/DSC01322.jpg.jpeg",
    mediaLabel:
      "Groom in an ivory and gold sherwani in a Lahore courtyard, full length in natural light",
  },
  {
    id: "wedding-edit",
    eyebrow: "THE WEDDING EDIT 2026",
    headingLines: ["Six ceremonies.", "Six ways to be dressed."],
    cta: { label: "SHOP BY OCCASION", href: "/shop/occasion" },
    mediaLabel: "Editorial grouping of ceremonial menswear for the six wedding events",
  },
]

/* --------------------------- Shop by garment ------------------------------- */

export const SHOP_BY_GARMENT = {
  heading: "Shop by garment",
  tiles: [
    {
      label: "Sherwani",
      href: "/shop/men/sherwani",
      mediaLabel: "Full-length ivory sherwani with an embroidered placket",
    },
    {
      label: "Prince Coat",
      href: "/shop/men/prince-coat",
      mediaLabel: "Full-length prince coat in deep navy, three-quarter view",
    },
    {
      label: "Waistcoat",
      href: "/shop/men/waistcoat",
      mediaLabel: "Torso crop of a ceremonial waistcoat with gold-work",
    },
    {
      label: "Shalwar Kameez",
      href: "/shop/men/shalwar-kameez",
      mediaLabel: "Full-length monochrome shalwar kameez, relaxed cut",
    },
    {
      label: "Western Suiting",
      href: "/shop/men/western-suiting",
      mediaLabel: "Full-length charcoal three-piece suit",
    },
    {
      label: "Made-to-Measure",
      href: "/made-to-measure",
      mediaLabel: "Atelier detail — tailor's chalk marking cloth beside a tape measure",
    },
  ] satisfies CategoryTile[],
} as const

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
