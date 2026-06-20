"use client";

import { Product, ProductsPerStep } from "@/app/constants/types/types";
import StepOptions from "../step-options/step-options";
import { useState } from "react";

export default function Builder({ products }: { products: Product[] }) {
  const [selectedProducts, setSelectedProducts] = useState<ProductsPerStep[]>(
    [],
  );
  console.log(selectedProducts);
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
        <h1 className="font-bold text-black">Review Your Build</h1>
      </div>
    </>
  );
}
