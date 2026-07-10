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
  SiSinaweibo,
  SiVimeo,
  SiVisa,
  SiWechat,
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
  { label: "Canali World", href: "#" },
]

export const ANNOUNCEMENTS: Announcement[] = [
  [
    { text: "Subscribe to the newsletter", href: "#" },
    { text: " to stay up to date with the latest news" },
  ],
  [
    { text: "Express shipping and free returns on all orders. " },
    { text: "Learn more", href: "#" },
  ],
]

export const HERO_SLIDES: HeroSlideContent[] = [
  {
    id: "high-summer",
    headingLines: ["High", "Summer"],
    eyebrow: "New Arrivals",
    cta: { label: "Discover More", href: "#" },
    mediaLabel: "High Summer hero",
  },
  {
    id: "designed-for-travel",
    headingLines: ["Designed", "for Travel"],
    eyebrow: "Spring Summer 2026",
    cta: { label: "Discover More", href: "#" },
    mediaLabel: "Spring Summer 2026 campaign video",
    hasVideo: true,
  },
]

/**
 * Unlabeled image row between the campaign hero and the category tiles.
 * Labels here are announced to assistive tech only, never printed.
 */
export const EDITORIAL_TILES: CategoryTile[] = [
  { label: "Summer editorial", href: "#", mediaLabel: "Summer editorial look" },
  { label: "Loafers", href: "#", mediaLabel: "Suede loafers editorial" },
  { label: "Linen shirts", href: "#", mediaLabel: "Linen shirt editorial" },
]

export const CATEGORY_TILES: CategoryTile[] = [
  { label: "Casual Pants", href: "#" },
  { label: "Shoes", href: "#" },
  { label: "Shirts", href: "#" },
]

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "kei-jacket",
    name: "White double-breasted linen and silk blend modern-fit Kei jacket",
    href: "#",
  },
  {
    id: "interlock-tee",
    name: "Milk-colored interlock jersey cotton T-shirt",
    href: "#",
  },
  {
    id: "cargo-pants",
    name: "Light gray linen and cotton cargo pants with drawstring",
    href: "#",
  },
  {
    id: "baseball-cap",
    name: "White linen and silk blend baseball cap",
    href: "#",
  },
]

export const INFO_COLUMNS: InfoColumn[] = [
  {
    title: "Find a Store",
    body: "A refined aesthetic as the perfect backdrop to showcase the Canali collections each season.",
    links: [
      { label: "Find your boutique", href: "#" },
      { label: "Book an appointment", href: "#" },
    ],
  },
  {
    title: "Me by Canali",
    body: "Me by Canali transforms the Made to Measure experience, allowing you to create a collection of both formal and casual garments.",
    links: [{ label: "Discover more", href: "#" }],
  },
  {
    title: "Canali Care",
    body: "The global project within which the company has decided to ascribe all its sustainability initiatives.",
    links: [{ label: "Discover more", href: "#" }],
  },
]

export const FOOTER_COLUMNS: SiteLinkColumn[] = [
  {
    title: "Our Brand",
    links: [
      { label: "About Us", href: "#" },
      { label: "Collection", href: "#" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "Request an appointment", href: "#" },
    ],
  },
  {
    title: "Legal & Privacy",
    links: [
      { label: "Website Terms of use", href: "#" },
      { label: "General sales conditions", href: "#" },
      { label: "Privacy", href: "#" },
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
  { label: "Pinterest", href: "#", icon: SiPinterest },
  { label: "Youtube", href: "#", icon: SiYoutube },
  { label: "Vimeo", href: "#", icon: SiVimeo },
  { label: "Weibo", href: "#", icon: SiSinaweibo },
  { label: "WeChat", href: "#", icon: SiWechat },
]

export const COPYRIGHT =
  "© 2026 Canali SpA a socio unico, soggetta a direzione e coordinamento di Canali Holding SpA - Partita I.V.A. 00694880964 - All Rights Reserved"
