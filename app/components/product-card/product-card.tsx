"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Placeholder from "@/public/assets/images/placeholder.webp";
import Counter from "../counter/counter";
import {
  Product,
  ProductsPerStep,
  StepValue,
  Variant,
} from "@/app/constants/types/types";

type Props = {
  product: Product;
  learnMoreUrl?: string;
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductsPerStep[]>>;
};

export default function ProductCard({
  product,
  learnMoreUrl = "#",
  setSelectedProducts,
}: Props) {
  const defaultProductCount = product.required ? 1 : 0;
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [variantCounts, setVariantCounts] = useState<Variant[]>(
    product.variants.map((v) => ({ ...v, count: defaultProductCount })),
  );

  const variantImage =
    product.variants && product.variants.length > 0
      ? product.variants[selectedVariant].image
      : product.masterImage;
  const isEmpty = variantCounts.every((c) => c.count === 0);

  const increment = () =>
    setVariantCounts((prev) =>
      prev.map((c, i) =>
        i === selectedVariant ? { ...c, count: c.count + 1 } : c,
      ),
    );

  const decrement = () => {
    if (product.required && variantCounts[selectedVariant].count === 1) return;
    setVariantCounts((prev) =>
      prev.map((c, i) =>
        i === selectedVariant ? { ...c, count: Math.max(0, c.count - 1) } : c,
      ),
    );
  };

  // For products with no variants
  const toggleProduct = () => {
    setVariantCounts((prev) => {
      const exists = prev.find((c) => c.label === product.name);
      if (exists) {
        return prev.filter((c) => c.label !== product.name);
      }
      return [...prev, { label: product.name, count: 1 }];
    });
  };

  useEffect(() => {
    setSelectedProducts((prev) => {
      // Filter out any previous entries for this product
      const filtered = prev.filter((item) => item.id !== product.id);

      // Create new entries for variants of this product that have count > 0
      const newSelections = variantCounts
        .filter((c) => c.count > 0)
        .map((c) => ({
          id: product.id,
          step: product.step as StepValue,
          count: c.count,
          variantLabel: c.label,
        }));

      return [...filtered, ...newSelections];
    });
  }, [variantCounts, product, setSelectedProducts]);

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
                variantCounts.length > 0
                  ? "border-border-chosen bg-chosen shadow-sm"
                  : "border-border-muted text-label bg-transparent"
              }`}
            >
              {variantCounts.length > 0 ? "Remove" : "Add"}
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
