"use client";

import {
  Product,
  ProductsPerStep,
  StepValue,
} from "@/app/constants/types/types";
import StepOptions from "../step-options/step-options";
import OrderReview from "../order-review/order-review";
import { useState } from "react";

export default function Builder({ products }: { products: Product[] }) {
  const [selectedProducts, setSelectedProducts] = useState<ProductsPerStep[]>(
    () =>
      // Pre-select all required products so they appear in the review from the start.
      // This replaces the old useEffect initialization that was in ProductCard.
      products
        .filter((product) => product.required && product.variants.length > 0)
        .map((product) => ({
          id: product.id,
          step: product.step as StepValue,
          count: 1,
          variantLabel: product.variants[0].label,
        })),
  );

  return (
    <>
      {/* Builder Column */}
      <div className="xl:col-span-2">
        <StepOptions
          products={products}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </div>

      {/* Review Column */}
      <div className="bg-primary-foreground rounded-base px-16 py-16 xl:col-span-1">
        <OrderReview
          products={products}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </div>
    </>
  );
}
