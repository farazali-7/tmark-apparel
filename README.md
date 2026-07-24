# T-Mark Apparel

A storefront and admin panel for a couture menswear house based in Lahore — the kind of shop that sells sherwanis, prince coats, ceremonial waistcoats and made-to-measure suiting. The project is a full front-end build: a public storefront and a complete back-office for running the catalogue, orders, customers, promotions and the homepage itself.

Everything the UI renders comes from typed mock data under `lib/mock-data`. The domain models in `types/index.ts` mirror the shapes an API is expected to return, so the interface is finished and wired against realistic data while the backend is still open. If you're evaluating the front end — layout, state, component design, the tailoring-specific workflow — it all runs locally with no services to stand up.

## Screenshots

```
/public/screenshots/storefront-home.png
/public/screenshots/admin-dashboard.png
/public/screenshots/orders-pipeline.png
```

## Features

### Storefront

- Editorial homepage with a hero slider, featured products, category tiles and an info band, all centred on a shared 1440px grid
- Sticky site header with a mega menu and inline search
- Newsletter capture and a footer with the usual store links
- Sign-in / sign-up screen with a tabbed layout, password visibility toggle and consent checkboxes
- Per-route metadata and JSON-LD structured data (Organization, BreadcrumbList) for the home page

### Admin — Catalogue

- **Products** — table and card views, a filtering toolbar, a details drawer and per-row actions
- **Categories** — grid and table views, a create form, summary cards and a details drawer
- **Collections** — manual and rule-based ("smart") collections, where products join automatically when they match a set of rules (category, fabric, tag, price, days since added)

### Admin — Commerce

- **Orders** — a tailoring-aware pipeline that runs from Pending through Measurements, Fabric Selection, Tailoring, Quality Check, Packed and Shipped to Delivered, with a production timeline, measurement cards and a create-order sheet. Order types cover ready-to-wear, made-to-measure and full custom tailoring
- **Customers** — segmentation, tiers (Member / Gold / Platinum), fit profiles, lifetime-value figures and a per-customer activity timeline
- **Reviews** — moderation states, a reputation overview, fit feedback (runs small / true to size / runs large) and a photo gallery
- **Promotions** — percentage, fixed, free-shipping, buy-X-get-Y and bundle offers, each with a scope, a lifecycle-aware countdown, usage progress and an analytics panel

### Admin — Storefront management

- **Homepage Builder** — reorderable sections (hero, featured categories/collections/products, brand story, testimonials, newsletter, and more), a live preview, undo/redo history and a publish dialog
- **Campaigns** — banner scheduling across homepage, category, collection, popup and announcement placements, with priority levels and a campaign timeline
- **Analytics** — dashboard charts built on Recharts

### Admin — System

- **Settings** — a searchable, grouped settings surface covering store info, shipping, payments, taxes, staff and roles, notifications, SEO, integrations, media, security and backups
- Command palette (⌘K) for jumping between admin sections
- Collapsible sidebar, breadcrumbs and a top bar

### Across the app

- Light and dark themes via `next-themes`, with a toggle and no flash on first paint
- Consistent status/tone system: a single set of metadata maps drives every badge, so an order stage, payment state or review status can never look different in two places
- Currency, number, date and relative-time formatting centralised in `lib/constants`
- Skip-to-content link, focus-visible states and labelled controls

## Tech Stack

**Framework**
- Next.js 16 (App Router, Server Components)
- React 19
- TypeScript 5

**UI & Styling**
- Tailwind CSS v4
- shadcn/ui on top of Radix primitives
- lucide-react and react-icons for iconography
- class-variance-authority, clsx and tailwind-merge for variant handling
- tw-animate-css for animation utilities
- Geist, Geist Mono and Bodoni Moda via `next/font`

**Forms & Validation**
- react-hook-form
- Zod, wired through `@hookform/resolvers`

**Data Visualisation**
- Recharts

**Interaction**
- cmdk for the command palette
- sonner for toasts
- next-themes for theming

**Tooling**
- ESLint 9 with `eslint-config-next`

## Project Structure

```text
app/
  (admin)/admin/      Dashboard and all back-office routes
  (auth)/account/     Sign in / sign up
  (storefront)/       Public storefront
  layout.tsx          Root layout: fonts, theme provider, toaster
  globals.css         Design tokens and Tailwind theme
components/
  ui/                 shadcn/ui primitives
  shared/             Cross-feature building blocks (data table, cards, drawers)
  layout/             Admin shell, sidebar, top bar, command menu
  storefront/         Public site header, footer, mega menu, search
config/               Navigation and settings navigation definitions
content/              Static storefront copy (homepage SEO, sections)
features/             Feature modules, one folder per admin/storefront area
  dashboard/ products/ categories/ collections/
  orders/ customers/ reviews/ promotions/
  banners/ homepage/ storefront/ auth/
hooks/                use-mobile, use-mounted
lib/
  constants/          Status metadata, formatters, domain vocabulary
  mock-data/          Typed sample data for every module
  utils.ts            cn() class helper
types/                Shared domain models
public/               Images and icons
```

Each area under `features/` owns its own view, components and any local helpers. Pages in `app/` stay thin — they set metadata and render the matching feature view.

## Getting Started

Requires Node 18.18 or newer.

Install:

```bash
npm install
```

Development:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). The storefront is at `/`, the admin panel at `/admin`, and the account screen at `/account`.

Production build:

```bash
npm run build
npm start
```

Lint:

```bash
npm run lint
```

## Environment Variables

None. The app runs entirely on local mock data and reads no environment variables. Add an `.env.local` when you introduce an API or third-party services — `.env*` is already gitignored.

## Architecture Overview

```
Browser
  ↓
Next.js App Router  (route groups: storefront / admin / auth)
  ↓
Feature views       (features/*)
  ↓
Mock data + types   (lib/mock-data, types)
```

Route groups keep the three surfaces isolated. `(storefront)` owns the public root namespace, `(admin)` lives under `/admin` with its own shell and is marked `noindex`, and `(auth)` handles the account screen. Admin navigation, the command menu and breadcrumbs all read from a single source in `config/nav.ts`, so routes can't drift between them.

## Key Technical Decisions

- **Feature-first layout.** Code is grouped by business area rather than by type. A change to orders touches `features/orders` and little else, and each feature exposes one view that its route renders.

- **Single source of truth for vocabulary.** Status labels, tones, icons and order-pipeline ordering live in `lib/constants`. Badges, tables, timelines and drawers all reference the same maps, which is what keeps the UI internally consistent.

- **Mock data behind real types.** `types/index.ts` defines the domain models the app is built against; `lib/mock-data` supplies instances. Swapping in a real data layer means replacing the mock modules, not rewriting the components.

- **Manual vs. smart collections.** Collections can be curated by hand or defined by rules that products match into automatically. The rule vocabulary (fields, operators, inputs) is declared once and drives the builder, the table and the details view.

- **Tailoring-specific order model.** Orders aren't a generic e-commerce status field — they move through a production pipeline with measurements, fabric selection, tailoring and quality-check stages, and distinguish ready-to-wear from made-to-measure and custom work.

- **Forms with react-hook-form + Zod.** Validation schemas are colocated with the forms that use them and resolved through `@hookform/resolvers`.

- **Theming without flash.** `next-themes` with `disableTransitionOnChange` and `suppressHydrationWarning`, plus a `useMounted` guard for client-only widgets like Recharts containers that measure the DOM.

## Performance

- Server Components by default; client boundaries only where interaction requires them
- Font optimisation through `next/font` with `display: swap` and size-adjusted fallbacks to avoid layout shift on first paint
- Client-only measurement widgets deferred past hydration so static prerendering stays clean
- Per-route metadata generated at the layout/page level

## Accessibility

- Skip-to-content link on the storefront, targeting a focusable `<main>`
- Focus-visible styling and keyboard-reachable controls
- Labelled form fields and `aria` attributes on interactive elements
- Command palette reachable by keyboard

## Responsive Design

Built mobile-first and tested from small phones up to wide desktops. The mobile breakpoint is 768px; below it the admin sidebar collapses into a sheet and dense tables give way to card views. The storefront is centred on a 1440px editorial grid with fluid gutters.

## Deployment

Configured for Vercel — the standard target for the Next.js App Router. `npm run build` produces a production build; on Vercel no extra configuration is needed. There are currently no environment variables or external services to provision. When a backend is added, set its variables in the Vercel project settings (or a local `.env.local`) before deploying.

## Future Improvements

- Replace the mock-data modules with a real API and persistence layer
- Wire authentication behind the existing sign-in screen and gate the admin routes
- Move list filtering, sorting and pagination to the server for large catalogues
- Add product, collection and account pages to the storefront beyond the homepage
- Introduce a test suite around the formatters, rule engine and order-stage logic

## Contributing

1. Fork and branch from `main` (`git checkout -b feature/your-change`).
2. Keep changes inside the relevant `features/` module where possible.
3. Run `npm run lint` before opening a pull request.
4. Match the existing conventions — shared vocabulary in `lib/constants`, primitives in `components/ui`, feature code in `features/`.

## License

Not currently licensed.

## Author

**Faraz Ali**

- Portfolio: [farazali.pro](https://farazali.pro)
- GitHub: [@farazali-7](https://github.com/farazali-7)
- Email: [farazbhatti170@gmail.com](mailto:farazbhatti170@gmail.com)
