<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Security Builder

A multi-step security product configurator built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. It guides users through selecting cameras, service plans, sensors, and accessories from a curated Wyze product catalog.

## Features

- **Multi-step flow** — products are organized into steps (cameras → plans → sensors → accessories)
- **Product variants** — color/finish selection per camera with live image switching
- **REST API route** — `/api/products` serves the product catalog from a local JSON data source
- **Discount support** — products carry original price, discounted price, and discount percentage
- **TypeScript** throughout, with strict linting via ESLint + Prettier
- **Git hooks** via Husky + lint-staged (auto-formats `.ts`, `.tsx`, `.json`, `.css`, `.md` on commit)

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
│   │       └── route.ts      # GET /api/products
│   └── page.tsx              # Entry page
├── data/
│   └── products.json         # Product catalog (11 products, 4 steps)
└── public/
    └── assets/               # Product images and icons
```

## API

### `GET /api/products`

Returns the full product catalog as a JSON array.

Each product includes:

```ts
{
  id: string;
  step: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  required: boolean;
  price: number;
  discount: number | null;        // percentage
  discountedPrice: number | null;
  learnMoreUrl: string;
  image?: string;                 // single image (plans, sensors, accessories)
  variants?: {                    // color variants (cameras)
    id: string;
    label: string;
    image: string;
  }[];
}
```

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
