import type { HomepageSectionType, SectionSettings } from "@/types"

/**
 * Editor schema. Each section type declares which settings it exposes and how
 * to render each control — so the right-hand editor is entirely data-driven and
 * a new field never touches component code.
 */
export type FieldControl = "text" | "textarea" | "select" | "toggle" | "segmented"

export interface FieldDescriptor {
  key: keyof SectionSettings
  label: string
  control: FieldControl
  placeholder?: string
  options?: { value: string; label: string }[]
  /** For select/segmented that store numbers. */
  numeric?: boolean
}

const OVERLAY = [
  { value: "none", label: "None" },
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "dark", label: "Dark" },
]
const ALIGN = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
]
const HEIGHT = [
  { value: "compact", label: "Compact" },
  { value: "medium", label: "Medium" },
  { value: "tall", label: "Tall" },
]
const BUTTON_STYLE = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
  { value: "minimal", label: "Minimal" },
]
const ANIMATION = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
]
const LAYOUT = [
  { value: "grid", label: "Grid" },
  { value: "carousel", label: "Carousel" },
  { value: "list", label: "List" },
]
const BACKGROUND = [
  { value: "surface", label: "Surface" },
  { value: "muted", label: "Muted" },
  { value: "ink", label: "Ink" },
]
const SPACING = [
  { value: "tight", label: "Tight" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
]
const COUNT = [
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "6", label: "6" },
  { value: "8", label: "8" },
]
const COLUMNS = [
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
]
const COLLECTIONS = [
  { value: "Wedding Collection", label: "Wedding Collection" },
  { value: "Summer Collection", label: "Summer Collection" },
  { value: "Best Sellers", label: "Best Sellers" },
  { value: "New Arrivals", label: "New Arrivals" },
  { value: "Eid Collection", label: "Eid Collection" },
]

export const SECTION_FIELDS: Record<HomepageSectionType, FieldDescriptor[]> = {
  hero: [
    { key: "title", label: "Title", control: "text", placeholder: "For the day you'll never forget" },
    { key: "subtitle", label: "Subtitle", control: "textarea", placeholder: "The 2026 wedding collection" },
    { key: "cta", label: "Button text", control: "text", placeholder: "Explore" },
    { key: "ctaLink", label: "Button link", control: "text", placeholder: "/collections/wedding" },
    { key: "cover", label: "Backdrop", control: "select", options: [
      { value: "wedding", label: "Wedding" },
      { value: "velvet", label: "Velvet" },
      { value: "summer", label: "Summer" },
      { value: "premium", label: "Premium" },
      { value: "editor", label: "Editorial" },
    ] },
    { key: "overlay", label: "Overlay", control: "segmented", options: OVERLAY },
    { key: "alignment", label: "Alignment", control: "segmented", options: ALIGN },
    { key: "height", label: "Height", control: "segmented", options: HEIGHT },
    { key: "buttonStyle", label: "Button style", control: "select", options: BUTTON_STYLE },
    { key: "animation", label: "Animation", control: "select", options: ANIMATION },
  ],
  featured_categories: [
    { key: "title", label: "Heading", control: "text", placeholder: "Shop by category" },
    { key: "layout", label: "Layout", control: "segmented", options: LAYOUT },
    { key: "columns", label: "Columns", control: "segmented", options: COLUMNS, numeric: true },
    { key: "spacing", label: "Spacing", control: "select", options: SPACING },
    { key: "background", label: "Background", control: "select", options: BACKGROUND },
  ],
  featured_collections: [
    { key: "title", label: "Heading", control: "text", placeholder: "Curated campaigns" },
    { key: "collection", label: "Collection", control: "select", options: COLLECTIONS },
    { key: "layout", label: "Layout", control: "segmented", options: LAYOUT },
    { key: "itemCount", label: "Products shown", control: "segmented", options: COUNT, numeric: true },
    { key: "cta", label: "CTA text", control: "text", placeholder: "View collection" },
    { key: "background", label: "Background", control: "select", options: BACKGROUND },
    { key: "spacing", label: "Spacing", control: "select", options: SPACING },
  ],
  featured_products: [
    { key: "title", label: "Heading", control: "text", placeholder: "Hand-picked for you" },
    { key: "itemCount", label: "Products shown", control: "segmented", options: COUNT, numeric: true },
    { key: "layout", label: "Layout", control: "segmented", options: LAYOUT },
    { key: "cta", label: "CTA text", control: "text", placeholder: "Shop all" },
    { key: "spacing", label: "Spacing", control: "select", options: SPACING },
  ],
  brand_story: [
    { key: "title", label: "Title", control: "text", placeholder: "Tailored since 1998" },
    { key: "subtitle", label: "Body", control: "textarea", placeholder: "Our story…" },
    { key: "cover", label: "Image", control: "select", options: [
      { value: "editor", label: "Editorial" },
      { value: "premium", label: "Premium" },
      { value: "winter", label: "Winter" },
    ] },
    { key: "alignment", label: "Alignment", control: "segmented", options: ALIGN },
    { key: "background", label: "Background", control: "select", options: BACKGROUND },
  ],
  custom_tailoring: [
    { key: "title", label: "Title", control: "text", placeholder: "Made to measure" },
    { key: "subtitle", label: "Body", control: "textarea", placeholder: "Book a private fitting…" },
    { key: "cta", label: "Button text", control: "text", placeholder: "Book a fitting" },
    { key: "ctaLink", label: "Button link", control: "text", placeholder: "/custom-tailoring" },
    { key: "background", label: "Background", control: "select", options: BACKGROUND },
    { key: "spacing", label: "Spacing", control: "select", options: SPACING },
  ],
  testimonials: [
    { key: "title", label: "Heading", control: "text", placeholder: "In their words" },
    { key: "layout", label: "Layout", control: "segmented", options: LAYOUT },
    { key: "itemCount", label: "Testimonials", control: "segmented", options: COUNT, numeric: true },
    { key: "background", label: "Background", control: "select", options: BACKGROUND },
  ],
  instagram: [
    { key: "title", label: "Heading", control: "text", placeholder: "Follow @tmark" },
    { key: "handle", label: "Instagram handle", control: "text", placeholder: "@tmarkapparel" },
    { key: "columns", label: "Columns", control: "segmented", options: COLUMNS, numeric: true },
    { key: "spacing", label: "Spacing", control: "select", options: SPACING },
  ],
  newsletter: [
    { key: "title", label: "Heading", control: "text", placeholder: "Join the atelier list" },
    { key: "subtitle", label: "Subtext", control: "textarea", placeholder: "Early access to new collections" },
    { key: "cta", label: "Button text", control: "text", placeholder: "Subscribe" },
    { key: "background", label: "Background", control: "select", options: BACKGROUND },
    { key: "alignment", label: "Alignment", control: "segmented", options: ALIGN },
  ],
  footer: [
    { key: "title", label: "Tagline", control: "text", placeholder: "Luxury menswear, tailored worldwide" },
    { key: "background", label: "Background", control: "select", options: BACKGROUND },
  ],
}
