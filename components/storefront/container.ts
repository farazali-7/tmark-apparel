/**
 * The storefront's editorial grid. Every full-bleed band centres its content on
 * this 1440px measure; the hero overrides the gutter but keeps the same shell.
 */
export const SITE_SHELL = "max-w-[1440px] mx-auto"

/** Shell plus the default gutter used by the bar, header, sections and footer. */
export const SITE_CONTAINER = `${SITE_SHELL} px-4 sm:px-6`

/** Target of the skip link; kept here so header and layout cannot disagree. */
export const MAIN_CONTENT_ID = "main-content"
