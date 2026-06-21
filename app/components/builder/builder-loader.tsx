"use client";

import dynamic from "next/dynamic";
import { Product } from "@/app/constants/types/types";

// Disable SSR for Builder so its localStorage-based useState initializer
// only ever runs in the browser — eliminating hydration mismatches.
const Builder = dynamic(() => import("./builder"), { ssr: false });

export default function BuilderLoader({ products }: { products: Product[] }) {
  return <Builder products={products} />;
}
