"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Placeholder from "@/public/assets/images/placeholder.webp";
import Counter from "../counter/counter";
import {
  ProductsPerStep,
  StepValue,
  Variant,
} from "@/app/constants/types/types";

type Props = {
  name: string;
  description: string;
  learnMoreUrl?: string;
  originalPrice: number;
  discountedPrice: number;
  savePercent?: number;
  variants: Variant[];
  step: StepValue;
  setSelectedCount: React.Dispatch<React.SetStateAction<ProductsPerStep[]>>;
};

export default function ProductCard({
  name,
  description,
  learnMoreUrl = "#",
  originalPrice,
  discountedPrice,
  savePercent,
  variants,
  step,
  setSelectedCount,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [counts, setCounts] = useState<Variant[]>(
    variants.map((v) => ({ label: v.label, count: 0 })),
  );
  const variantImage = variants[selectedVariant].image;
  const isEmpty = counts.every((c) => c.count === 0);

  const increment = () =>
    setCounts((prev) =>
      prev.map((c, i) =>
        i === selectedVariant ? { ...c, count: c.count + 1 } : c,
      ),
    );

  const decrement = () =>
    setCounts((prev) =>
      prev.map((c, i) =>
        i === selectedVariant ? { ...c, count: Math.max(0, c.count - 1) } : c,
      ),
    );

  useEffect(() => {
    setSelectedCount((prev) => {
      const existing = prev.find((item) => item.step === step);
      if (existing) {
        return prev.map((item) =>
          item.step === step ? { ...item, count: isEmpty ? 0 : 1 } : item,
        );
      }
      return [...prev, { step, count: isEmpty ? 0 : 1 }];
    });
  }, [counts, step, setSelectedCount, isEmpty]);

  return (
    <div
      className={`rounded-base p-11px ${isEmpty ? "border-white" : "border-border-primary"} flex gap-4 border-2 bg-white`}
    >
      {/* Left — image + badge */}
      <div className="relative flex">
        {savePercent && (
          <span className="bg-primary absolute top-0 left-0 rounded-full px-1.5 py-0.5 text-xs font-semibold text-white">
            Save {savePercent}%
          </span>
        )}
        <Image
          src={variantImage ?? Placeholder}
          alt={name}
          width={120}
          height={120}
          className="object-cover"
        />
      </div>

      {/* Right — details */}
      <div className="flex flex-col gap-2.5">
        {/* Title + description */}
        <div>
          <h3 className="text-secondary mb-2 font-semibold">{name}</h3>
          <p className="text-secondary-foreground flex flex-col text-xs font-medium">
            {description}
            <span>
              <a
                href={learnMoreUrl}
                className="text-link text-xs font-medium underline"
              >
                Learn More
              </a>
            </span>
          </p>
        </div>

        {/* Variants */}
        <div className="flex gap-2">
          {variants.map((variant, i) => (
            <button
              key={variant.label}
              onClick={() => setSelectedVariant(i)}
              className={`border-0.5 flex items-center gap-1.5 rounded-xs border px-1.5 py-2 text-sm font-medium transition-all duration-200 ${
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

        {/* Counter + Price */}
        <div className="flex items-center justify-between">
          {/* Counter */}
          <Counter
            counts={counts}
            selectedVariant={selectedVariant}
            increment={increment}
            decrement={decrement}
          />

          {/* Price */}
          <div className="text-right">
            <p className="text-danger line-through">
              ${originalPrice.toFixed(2)}
            </p>
            <p className="text-price">${discountedPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
