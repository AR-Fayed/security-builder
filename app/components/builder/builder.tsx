"use client";

import { Product, ProductsPerStep } from "@/app/constants/types/types";
import StepOptions from "../step-options/step-options";
import OrderReview from "../order-review/order-review";
import { useState } from "react";
import { getInitialProducts } from "@/app/lib/helpers/selected-products";

export default function Builder({ products }: { products: Product[] }) {
  const [selectedProducts, setSelectedProducts] = useState<ProductsPerStep[]>(
    () => getInitialProducts(products),
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
