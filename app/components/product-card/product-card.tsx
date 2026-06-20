"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  step: StepValue;
  setSelectedCount: React.Dispatch<React.SetStateAction<ProductsPerStep[]>>;
};

export default function ProductCard({
  product,
  learnMoreUrl = "#",
  step,
  setSelectedCount,
}: Props) {
  const defaultProductCount = product.required ? 1 : 0;
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [counts, setCounts] = useState<Variant[]>(
    product.variants.map((v) => ({ ...v, count: defaultProductCount })),
  );

  const variantImage =
    product.variants && product.variants.length > 0
      ? product.variants[selectedVariant].image
      : product.masterImage;
  const isEmpty = counts.every((c) => c.count === 0);
  // Track this card's previous contribution so we can apply a delta
  const prevCardTotal = useRef(0);

  const increment = () =>
    setCounts((prev) =>
      prev.map((c, i) =>
        i === selectedVariant ? { ...c, count: c.count + 1 } : c,
      ),
    );

  const decrement = () => {
    if (product.required && counts[selectedVariant].count === 1) return;
    setCounts((prev) =>
      prev.map((c, i) =>
        i === selectedVariant ? { ...c, count: Math.max(0, c.count - 1) } : c,
      ),
    );
  };

  // For products with no variants
  const toggleProduct = () => {
    setCounts((prev) => {
      const exists = prev.find((c) => c.label === product.name);
      if (exists) {
        return prev.filter((c) => c.label !== product.name);
      }
      return [...prev, { id: product.id, label: product.name, count: 1 }];
    });
  };

  useEffect(() => {
    const cardTotal = counts.reduce((sum, c) => sum + c.count, 0);
    const prevTotal = prevCardTotal.current;
    const totalDelta = cardTotal - prevTotal;
    prevCardTotal.current = cardTotal;

    if (totalDelta === 0) return;

    // +1 if this card just became non-empty, -1 if it just became empty, 0 otherwise
    const countDelta =
      prevTotal === 0 && cardTotal > 0
        ? 1
        : prevTotal > 0 && cardTotal === 0
          ? -1
          : 0;

    setSelectedCount((prev) => {
      const existing = prev.find((item) => item.step === step);
      if (existing) {
        return prev.map((item) =>
          item.step === step
            ? {
                ...item,
                count: Math.max(0, item.count + countDelta),
                total: Math.max(0, item.total + totalDelta),
              }
            : item,
        );
      }
      return [
        ...prev,
        { step, count: cardTotal > 0 ? 1 : 0, total: cardTotal },
      ];
    });
  }, [counts, step, setSelectedCount]);

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
              counts={counts}
              selectedVariant={selectedVariant}
              increment={increment}
              decrement={decrement}
              disabledAt={product.required ? 1 : 0}
            />
          ) : (
            <button
              onClick={toggleProduct}
              className={`border-0.5 flex items-center gap-1.5 rounded-xs border px-1.5 py-2 text-sm font-medium transition-all duration-200 ${
                counts.length > 0
                  ? "border-border-chosen bg-chosen shadow-sm"
                  : "border-border-muted text-label bg-transparent"
              }`}
            >
              {counts.length > 0 ? "Remove" : "Add"}
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
