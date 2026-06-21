"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Product, ProductsPerStep } from "@/app/constants/types/types";
import { Steps } from "@/app/constants/enums/enums";
import Placeholder from "@/public/assets/images/placeholder.webp";

type Props = {
  products: Product[];
  selectedProducts: ProductsPerStep[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductsPerStep[]>>;
};

type SectionConfig = {
  step: Steps;
  label: string;
};

const SECTIONS: SectionConfig[] = [
  { step: Steps.cameras, label: "Cameras" },
  { step: Steps.plans, label: "Plan" },
  { step: Steps.sensors, label: "Sensors" },
  { step: Steps.accessories, label: "Accessories" },
  { step: Steps.shipping, label: "Shipping" },
];

export default function OrderReview({
  products,
  selectedProducts,
  setSelectedProducts,
}: Props) {
  const handleIncrement = (id: string, variantLabel: string) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item.id === id && item.variantLabel === variantLabel
          ? { ...item, count: item.count + 1 }
          : item,
      ),
    );
  };

  const handleDecrement = (
    id: string,
    variantLabel: string,
    required: boolean,
  ) => {
    setSelectedProducts((prev) =>
      prev
        .map((item) =>
          item.id === id && item.variantLabel === variantLabel
            ? { ...item, count: Math.max(required ? 1 : 0, item.count - 1) }
            : item,
        )
        .filter((item) => item.count > 0),
    );
  };

  // Build enriched line items: merge selectedProducts with product catalog data
  const lineItems = selectedProducts
    .map((selected) => {
      const product = products.find((product) => product.id === selected.id);
      if (!product) return null;

      // Resolve the image for this variant
      const variant = product.variants?.find(
        (variant) => variant.label === selected.variantLabel,
      );
      const image = variant?.image ?? product.masterImage;

      return { ...selected, product, image };
    })
    .filter(Boolean) as Array<{
    id: string;
    step: number;
    count: number;
    variantLabel: string;
    product: Product;
    image: string;
  }>;

  // Totals — plan/shipping priced per-item regardless of count
  const totalOriginal = lineItems.reduce((acc, item) => {
    const pricePerUnit = item.product.price;
    // Plan & shipping are not multiplied by count
    const qty =
      item.product.step === Steps.plans || item.product.step === Steps.shipping
        ? 1
        : item.count;
    return acc + pricePerUnit * qty;
  }, 0);

  const totalDiscounted = lineItems.reduce((acc, item) => {
    const effectivePrice =
      item.product.discountedPrice !== null
        ? item.product.discountedPrice
        : item.product.price;
    const qty =
      item.product.step === Steps.plans || item.product.step === Steps.shipping
        ? 1
        : item.count;
    return acc + effectivePrice * qty;
  }, 0);

  const totalSavings = totalOriginal - totalDiscounted;
  const hasSavings = totalSavings > 0.005;

  // Monthly plan cost (if any plan selected)
  const planItem = lineItems.find((item) => item.product.step === Steps.plans);
  const monthlyPrice =
    planItem?.product.discountedPrice !== null
      ? planItem?.product.discountedPrice
      : planItem?.product.price;

  const isEmpty = lineItems.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-5">
        <p className="text-secondary-muted mb-2 text-xs font-semibold tracking-widest uppercase">
          Review
        </p>
        <h2 className="text-secondary-heading text-2xl leading-tight font-bold">
          Your security system
        </h2>
        <p className="text-secondary-foreground mt-1 text-sm">
          Review your personalized protection system designed to keep what
          matters most safe.
        </p>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-secondary-muted text-center text-sm">
            No products selected yet.
            <br />
            Start building your system.
          </p>
        </div>
      )}

      {/* Line item sections */}
      {!isEmpty && (
        <div className="flex-1 space-y-4">
          {SECTIONS.map(({ step, label }) => {
            const items = lineItems.filter(
              (item) => item.product.step === step,
            );
            if (items.length === 0) return null;

            return (
              <div key={step}>
                {/* Section label */}
                <p className="text-secondary-muted text-10px mb-2 font-semibold tracking-widest uppercase">
                  {label}
                </p>

                <div className="divide-border-muted/40 divide-y">
                  {items.map((item) => {
                    const isPlan = item.product.step === Steps.plans;
                    const isShipping = item.product.step === Steps.shipping;
                    const isFree =
                      item.product.discountedPrice !== null &&
                      item.product.discountedPrice === 0;
                    const hasDiscount =
                      item.product.discountedPrice !== null &&
                      item.product.discountedPrice !== item.product.price;
                    const isPerMonth = isPlan;

                    const displayPrice = hasDiscount
                      ? item.product.discountedPrice!
                      : item.product.price;

                    return (
                      <div
                        key={`${item.id}-${item.variantLabel}`}
                        className="flex items-center gap-3 py-2.5"
                      >
                        {/* Product image */}
                        <div className="relative h-9 w-9 shrink-0">
                          <Image
                            src={item.image || Placeholder}
                            alt={item.product.name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        {/* Name */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm leading-tight font-medium ${
                              isPlan
                                ? "text-primary font-semibold"
                                : "text-secondary-heading"
                            }`}
                          >
                            {item.product.name}
                          </p>
                        </div>

                        {/* Counter — only for non-plan / non-shipping items */}
                        {!isPlan && !isShipping && (
                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              aria-label="Decrease"
                              onClick={() =>
                                handleDecrement(
                                  item.id,
                                  item.variantLabel,
                                  item.product.required,
                                )
                              }
                              disabled={
                                item.product.required
                                  ? item.count <= 1
                                  : item.count <= 0
                              }
                              className={`rounded-sm border-2 p-0.5 transition-all ${
                                (
                                  item.product.required
                                    ? item.count <= 1
                                    : item.count <= 0
                                )
                                  ? "text-counter-muted border-counter-muted opacity-50"
                                  : "text-label bg-background-counter border-background-counter hover:text-primary"
                              }`}
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-secondary-heading w-4 text-center text-xs font-semibold">
                              {item.count}
                            </span>
                            <button
                              aria-label="Increase"
                              onClick={() =>
                                handleIncrement(item.id, item.variantLabel)
                              }
                              className="text-label bg-background-counter border-background-counter hover:text-primary rounded-sm border-2 p-0.5 transition-all"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        )}

                        {/* Price column */}
                        <div className="min-w-[56px] shrink-0 text-right">
                          {isFree ? (
                            <>
                              {hasDiscount && (
                                <p className="text-danger text-[11px] leading-none line-through">
                                  ${item.product.price.toFixed(2)}
                                </p>
                              )}
                              <p className="text-success text-sm font-semibold">
                                FREE
                              </p>
                            </>
                          ) : (
                            <>
                              {hasDiscount && (
                                <p className="text-danger text-[11px] leading-none line-through">
                                  ${item.product.price.toFixed(2)}
                                  {isPerMonth ? "/mo" : ""}
                                </p>
                              )}
                              <p className="text-price text-sm font-semibold">
                                ${displayPrice.toFixed(2)}
                                {isPerMonth && (
                                  <span className="text-[11px] font-normal">
                                    /mo
                                  </span>
                                )}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer summary */}
      {!isEmpty && (
        <div className="border-border-muted/50 mt-5 space-y-3 border-t pt-4">
          {/* "as low as" badge + totals */}
          <div className="flex items-end justify-between">
            {/* Left — badge */}
            <div className="flex flex-col gap-1">
              {monthlyPrice !== undefined && (
                <span className="bg-primary inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  as low as ${monthlyPrice?.toFixed(2)}/mo
                </span>
              )}
              {hasSavings && (
                <p className="text-danger text-[11px] line-through">
                  ${totalOriginal.toFixed(2)}
                </p>
              )}
            </div>

            {/* Right — total */}
            <div className="text-right">
              <p className="text-secondary-heading text-2xl font-bold">
                ${totalDiscounted.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Savings callout */}
          {hasSavings && (
            <p className="text-success text-center text-xs font-semibold">
              Congrats! You&apos;re saving ${totalSavings.toFixed(2)} on your
              security bundle!
            </p>
          )}

          {/* Checkout button */}
          <button
            id="checkout-btn"
            className="bg-primary w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            Checkout
          </button>

          {/* Save for later */}
          <p className="text-center">
            <button
              id="save-for-later-btn"
              className="text-secondary-foreground hover:text-secondary text-xs underline underline-offset-2 transition-colors"
            >
              Save my system for later
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
