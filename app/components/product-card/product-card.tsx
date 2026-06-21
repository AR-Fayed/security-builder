"use client";

import Image from "next/image";
import { useState } from "react";
import Placeholder from "@/public/assets/images/placeholder.webp";
import Counter from "../counter/counter";
import {
  Product,
  ProductsPerStep,
  StepValue,
} from "@/app/constants/types/types";

type Props = {
  product: Product;
  learnMoreUrl?: string;
  selectedProducts: ProductsPerStep[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductsPerStep[]>>;
};

export default function ProductCard({
  product,
  learnMoreUrl = "#",
  selectedProducts,
  setSelectedProducts,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Derive counts directly from selectedProducts — single source of truth.
  // No local state, no sync effects.
  const variantCounts = product.variants.map((productVariant) => {
    const match = selectedProducts.find(
      (s) => s.id === product.id && s.variantLabel === productVariant.label,
    );
    return { ...productVariant, count: match?.count ?? 0 };
  });

  const variantImage =
    product.variants && product.variants.length > 0
      ? product.variants[selectedVariant].image
      : product.masterImage;

  const isEmpty = variantCounts.every((c) => c.count === 0);

  const increment = () => {
    const variant = product.variants[selectedVariant];
    if (!variant) return;
    setSelectedProducts((prev) => {
      const existing = prev.find(
        (selectedProduct) =>
          selectedProduct.id === product.id &&
          selectedProduct.variantLabel === variant.label,
      );
      if (existing) {
        return prev.map((selectedProduct) =>
          selectedProduct.id === product.id &&
          selectedProduct.variantLabel === variant.label
            ? { ...selectedProduct, count: selectedProduct.count + 1 }
            : selectedProduct,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          step: product.step as StepValue,
          count: 1,
          variantLabel: variant.label,
        },
      ];
    });
  };

  const decrement = () => {
    const variant = product.variants[selectedVariant];
    if (!variant) return;
    const currentCount = variantCounts[selectedVariant]?.count ?? 0;
    if (product.required && currentCount <= 1) return;
    setSelectedProducts((prev) =>
      prev
        .map((selectedProduct) =>
          selectedProduct.id === product.id &&
          selectedProduct.variantLabel === variant.label
            ? {
                ...selectedProduct,
                count: Math.max(0, selectedProduct.count - 1),
              }
            : selectedProduct,
        )
        .filter(
          (selectedProduct) =>
            !(
              selectedProduct.id === product.id &&
              selectedProduct.variantLabel === variant.label &&
              selectedProduct.count === 0
            ),
        ),
    );
  };

  // For plan/shipping products with no variants
  const toggleProduct = () => {
    setSelectedProducts((prev) => {
      const exists = prev.find(
        (selectedProduct) => selectedProduct.id === product.id,
      );
      if (exists) {
        return prev.filter(
          (selectedProduct) => selectedProduct.id !== product.id,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          step: product.step as StepValue,
          count: 1,
          variantLabel: product.name,
        },
      ];
    });
  };

  const isToggled = selectedProducts.some(
    (selectedProduct) => selectedProduct.id === product.id,
  );

  return (
    <div
      className={`rounded-base p-11px max-w-72 min-w-72 xl:max-w-[47%] xl:min-w-[47%] ${isEmpty ? "border-white" : "border-border-primary"} flex flex-col gap-4 border-2 bg-white xl:flex-row`}
    >
      {/* Left — image + badge */}
      <div className="relative">
        {product.discount && (
          <span className="bg-primary absolute top-0 left-0 rounded-full px-1.5 py-0.5 text-xs font-semibold text-white">
            Save {product.discount}%
          </span>
        )}
        <Image
          src={variantImage ?? Placeholder}
          alt={product.name}
          width={120}
          height={120}
          className="h-full w-full object-contain xl:w-32"
        />
      </div>

      {/* Right — details */}
      <div className="flex min-w-[68%] flex-col gap-2.5">
        {/* Title + description */}
        <div>
          <h3 className="text-secondary mb-2 text-lg font-semibold xl:text-base">
            {product.name}
          </h3>
          <p className="text-secondary-foreground flex flex-col text-sm font-medium xl:text-xs">
            {product.description}
            <span>
              <a
                href={learnMoreUrl}
                className="text-link font-medium underline"
              >
                Learn More
              </a>
            </span>
          </p>
        </div>

        {/* Variants */}
        {product.variants.length > 1 && (
          <div className="flex gap-2">
            {product.variants.map((variant, i) => (
              <button
                key={variant.label}
                onClick={() => setSelectedVariant(i)}
                className={`border-0.5 flex items-center gap-0.5 rounded-xs border px-1.5 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedVariant === i
                    ? "border-border-chosen bg-chosen shadow-sm"
                    : "border-border-muted text-label bg-transparent"
                }`}
              >
                <Image
                  src={variant.image ?? Placeholder}
                  alt={variant.label}
                  width={16}
                  height={16}
                  className="rounded-full object-cover"
                />
                {variant.label}
              </button>
            ))}
          </div>
        )}

        {/* Counter + Price */}
        <div className="flex items-center justify-between">
          {/* Counter */}
          {product.variants.length > 0 ? (
            <Counter
              variantCounts={variantCounts}
              selectedVariant={selectedVariant}
              increment={increment}
              decrement={decrement}
              disabledAt={product.required ? 1 : 0}
            />
          ) : (
            <button
              onClick={toggleProduct}
              className={`border-0.5 flex items-center gap-1.5 rounded-xs border px-1.5 py-2 text-sm font-medium transition-all duration-200 ${
                isToggled
                  ? "border-border-chosen bg-chosen shadow-sm"
                  : "border-border-muted text-label bg-transparent"
              }`}
            >
              {isToggled ? "Remove" : "Add"}
            </button>
          )}

          {/* Price */}
          <div className="flex gap-2 text-right xl:flex-col xl:gap-0">
            {product.discountedPrice !== null ? (
              <>
                <p className="text-danger line-through">
                  ${product.price.toFixed(2)}
                </p>

                <p className="text-price">
                  ${product.discountedPrice?.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-price">${product.price.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
