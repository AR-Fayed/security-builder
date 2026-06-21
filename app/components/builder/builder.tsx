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
    () => {
      // Pre-select required products (e.g. Wyze Sense Hub) so they appear in the review from the start.
      const required = products
        .filter((product) => product.required && product.variants.length > 0)
        .map((product) => ({
          id: product.id,
          step: product.step as StepValue,
          count: 1,
          variantLabel: product.variants[0].label,
        }));

      // Pre-select shipping products (step 5) — they have no accordion UI.
      const shipping = products
        .filter((p) => p.step === 5)
        .map((p) => ({
          id: p.id,
          step: p.step as StepValue,
          count: 1,
          variantLabel: p.variants.length > 0 ? p.variants[0].label : p.name,
        }));

      return [...required, ...shipping];
    },
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
      <OrderReview
        products={products}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
    </>
  );
}
