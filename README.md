# Security Builder

A multi-step security product configurator built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. It guides users through selecting cameras, service plans, sensors, and accessories from a curated Wyze product catalog, with a live order review panel that syncs in real time.

## Features

- **Multi-step accordion flow** — products are organized into 4 collapsible steps (cameras → plans → sensors → accessories), each with a progress counter and a "Next" action button
- **Product variants** — color/finish selection per product with live image switching and per-variant quantity tracking
- **Live order review panel** — a sidebar that syncs instantly with step selections, grouped by category (Cameras, Sensors, Accessories, Plan, Shipping)
- **Quantity management** — increment/decrement counters in both the builder steps and the order review panel; required products enforce a minimum count of 1
- **Pricing & discounts** — original price, discounted price, discount badge, per-item savings, and a total savings callout
- **Monthly plan pricing** — plan items display `/mo` pricing and an "as low as $X/mo" summary badge
- **Free shipping** — automatically included (step 5, pre-selected, shown as FREE in the review panel)
- **Required product pre-selection** — products marked `required: true` (e.g. Wyze Sense Hub) are pre-selected and cannot be fully removed
- **Bundle persistence** — "Save my system for later" serializes the current selection to `localStorage`; the selection is restored on next visit
- **Hydration-safe SSR** — `BuilderLoader` wraps the client `Builder` component with `dynamic(..., { ssr: false })` to prevent hydration mismatches from `localStorage` reads
- **REST API route** — `GET /api/products` serves the product catalog from a local JSON data source
- **TypeScript** throughout, with strict linting via ESLint + Prettier
- **Git hooks** via Husky + lint-staged (auto-formats `.ts`, `.tsx`, `.json`, `.css`, `.md` on commit)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Script          | Description                 |
| --------------- | --------------------------- |
| `npm run dev`   | Start the dev server        |
| `npm run build` | Build for production        |
| `npm run start` | Start the production server |
| `npm run lint`  | Run ESLint                  |

## Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Framework | Next.js 16 (App Router) |
| UI        | React 19                |
| Styling   | Tailwind CSS v4         |
| Icons     | Lucide React            |
| Language  | TypeScript 5            |
| Linting   | ESLint 9, Prettier 3    |
| Git hooks | Husky 9, lint-staged    |

## Project Structure

```
security-builder/
├── app/
│   ├── api/
│   │   └── products/
│   │       └── route.ts              # GET /api/products
│   ├── components/
│   │   ├── accordion/
│   │   │   └── accordion.tsx         # Collapsible step wrapper with counter badge
│   │   ├── action-btn/
│   │   │   └── action-btn.tsx        # "Next / Done" button (outline | filled)
│   │   ├── builder/
│   │   │   ├── builder.tsx           # Client root: shared selectedProducts state
│   │   │   └── builder-loader.tsx    # Dynamic import wrapper (SSR disabled)
│   │   ├── counter/
│   │   │   └── counter.tsx           # +/- counter (productCard | orderReview variants)
│   │   ├── order-review/
│   │   │   └── order-review.tsx      # Review panel: line items, totals, checkout
│   │   ├── product-card/
│   │   │   └── product-card.tsx      # Product tile with variants, counter, and price
│   │   └── step-options/
│   │       └── step-options.tsx      # Renders the 4 accordion steps
│   ├── constants/
│   │   ├── enums/
│   │   │   └── enums.ts              # Steps, StepsTitle, StepsIcons enums
│   │   └── types/
│   │       └── types.ts              # Product, Variant, ProductsPerStep, StepValue types
│   ├── lib/
│   │   ├── api.ts                    # getProducts() — fetches /api/products
│   │   └── helpers/
│   │       └── selected-products.ts  # getDefaults() & getInitialProducts() with localStorage
│   ├── styles/
│   │   └── globals.css               # Tailwind v4 base + custom design tokens
│   ├── layout.tsx                    # Root layout (Geist font, metadata)
│   └── page.tsx                      # Server component entry: fetches products, renders BuilderLoader
├── data/
│   └── products.json                 # Product catalog (10 products, 5 steps)
└── public/
    └── assets/
        ├── icons/                    # Step icons and plan/delivery SVGs
        └── images/                   # Product images (camera variants, sensors, accessories)
```

## State Management

All selection state lives in a single `selectedProducts: ProductsPerStep[]` array owned by `Builder` and passed down as props. Each entry represents one selected product+variant combination:

```ts
type ProductsPerStep = {
  id: string; // product ID
  step: StepValue; // 1 | 2 | 3 | 4 | 5
  count: number; // quantity
  variantLabel: string; // e.g. "White", "Black", or product name for no-variant items
};
```

`ProductCard` derives its display state directly from `selectedProducts` — there is no local count state, avoiding any sync drift.

## LocalStorage Persistence

On load, `getInitialProducts()` checks `localStorage` for a `"selected-bundle"` key:

- **If found and valid**: restores the saved selection
- **If empty or corrupted**: falls back to `getDefaults()`, which pre-selects all `required` products and the shipping item
- **SSR guard**: returns defaults immediately if `window` is undefined (server context)

Saving is triggered manually via the **"Save my system for later"** button in the review panel, which writes the current enriched line items to `localStorage`.

## API

### `GET /api/products`

Returns the full product catalog as a JSON array.

Each product includes:

```ts
{
  id: string;
  step: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  required: boolean;
  price: number;
  discount: number | null;          // percentage shown as badge
  discountedPrice: number | null;
  learnMoreUrl: string;
  masterImage: string;              // fallback / single-variant image
  variants: {                       // always present; empty array for toggle-style products
    id: string;
    label: string;
    image?: string;
    count: number;
  }[];
}
```

> **Note**: Products with an empty `variants` array (plans, shipping) use an Add/Remove toggle instead of the +/- counter.

## Product Catalog

| Step | Category    | Products                                                                                          |
| ---- | ----------- | ------------------------------------------------------------------------------------------------- |
| 1    | Cameras     | Wyze Cam v4, Wyze Cam Pan v3, Wyze Cam Floodlight v2, Wyze Duo Cam Doorbell, Wyze Battery Cam Pro |
| 2    | Plans       | Cam Unlimited                                                                                     |
| 3    | Sensors     | Wyze Sense Motion Sensor, Wyze Sense Hub _(required)_                                             |
| 4    | Accessories | Wyze MicroSD Card (256 GB)                                                                        |
| 5    | Shipping    | Fast Shipping _(free, auto-included)_                                                             |
