import {
  SiAmericanexpress,
  SiApplepay,
  SiDinersclub,
  SiDiscover,
  SiFacebook,
  SiGooglepay,
  SiInstagram,
  SiJcb,
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
  SiteLink,
  SiteLinkColumn,
  SocialLink,
} from "@/types"

/**
 * Storefront copy and navigation. Every `href` is "#" until the matching route
 * ships — routing is centralised here so wiring up a real page is a one-line
 * change rather than a hunt through JSX.
 */

export const SITE_NAV: SiteLink[] = [
  { label: "New Arrivals", href: "#" },
  { label: "Clothing", href: "#" },
  { label: "Shoes", href: "#" },
  { label: "Accessories", href: "#" },
  { label: "Highlights", href: "#" },
  { label: "Made to Measure", href: "#" },
  { label: "Our Brand", href: "#" },
]

export const ANNOUNCEMENTS: Announcement[] = [
  [
    { text: "Subscribe", href: "#" },
    {
      text: " to receive exclusive updates, new collections and special offers from T-Mark Apparel.",
    },
  ],
  [
    { text: "Express shipping and free returns on all orders. " },
    { text: "Learn more", href: "#" },
  ],
]

export const HERO_SLIDES: HeroSlideContent[] = [
  {
    id: "summer-collection",
    headingLines: ["Summer", "Collection"],
    eyebrow: "New Arrivals",
    cta: { label: "Discover More", href: "#" },
    mediaLabel: "Summer Collection hero",
  },
  {
    id: "crafted-for-every-occasion",
    headingLines: ["Crafted for", "Every Occasion"],
    eyebrow: "Spring / Summer Collection",
    cta: { label: "Discover More", href: "#" },
    mediaLabel: "Spring / Summer Collection campaign video",
    hasVideo: true,
  },
]

export const CATEGORY_TILES: CategoryTile[] = [
  { label: "Casual Pants", href: "#" },
  { label: "Shoes", href: "#" },
  { label: "Shirts", href: "#" },
]

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "linen-silk-jacket",
    name: "Ivory double-breasted linen and silk blend modern-fit jacket",
    href: "#",
  },
  {
    id: "interlock-tee",
    name: "Off-white interlock jersey cotton T-shirt",
    href: "#",
  },
  {
    id: "drawstring-trousers",
    name: "Light grey linen and cotton trousers with drawstring",
    href: "#",
  },
  {
    id: "linen-silk-cap",
    name: "White linen and silk blend cap",
    href: "#",
  },
]

export const INFO_COLUMNS: InfoColumn[] = [
  {
    title: "Visit Our Store",
    body: "Experience T-Mark Apparel in person. Our store offers a calm, considered setting in which to explore each season's collections, guided by our advisors.",
    links: [
      { label: "Find Our Store", href: "#" },
      { label: "Book a Consultation", href: "#" },
    ],
  },
  {
    title: "Made-to-Measure",
    body: "Create garments tailored exclusively for you through our premium Made-to-Measure experience, combining expert craftsmanship with timeless elegance.",
    links: [{ label: "Discover more", href: "#" }],
  },
  {
    title: "Craftsmanship & Quality",
    body: "Every T-Mark Apparel garment is cut, finished and inspected to exacting standards — a commitment to quality, craftsmanship and your complete satisfaction, upheld since 2003.",
    links: [{ label: "Discover more", href: "#" }],
  },
]

export const FOOTER_COLUMNS: SiteLinkColumn[] = [
  {
    title: "About T-Mark Apparel",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Collections", href: "#" },
      { label: "Made-to-Measure", href: "#" },
      { label: "Store Locator", href: "#" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "Book an Appointment", href: "#" },
      { label: "Shipping & Returns", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Legal & Privacy",
    links: [
      { label: "Terms & Conditions", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Accessibility Statement", href: "#" },
    ],
  },
]

/** Brands without a simple-icons glyph render as a text pill — see PaymentMethod. */
export const PAYMENT_METHODS: PaymentMethod[] = [
  { label: "Affirm" },
  { label: "Amex", icon: SiAmericanexpress, color: "#006FCF" },
  { label: "Apple Pay", icon: SiApplepay, color: "#000000" },
  { label: "Diners", icon: SiDinersclub, color: "#0079BE" },
  { label: "Discover", icon: SiDiscover, color: "#FF6000" },
  { label: "G Pay", icon: SiGooglepay, color: "#4285F4" },
  { label: "JCB", icon: SiJcb, color: "#0E4C96" },
  { label: "Mastercard", icon: SiMastercard, color: "#EB001B" },
  { label: "PayPal", icon: SiPaypal, color: "#00457C" },
  { label: "Union Pay" },
  { label: "Visa", icon: SiVisa, color: "#1A1F71" },
]

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "#", icon: SiFacebook },
  { label: "X", href: "#", icon: SiX },
  { label: "Instagram", href: "#", icon: SiInstagram },
  { label: "TikTok", href: "#", icon: SiTiktok },
  { label: "Pinterest", href: "#", icon: SiPinterest },
  { label: "Youtube", href: "#", icon: SiYoutube },
]

export const COPYRIGHT =
  "© 2026 T-Mark Apparel. Luxury menswear, crafted since 2003. All rights reserved."
