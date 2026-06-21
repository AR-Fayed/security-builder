"use client";

import Image from "next/image";
import { Product, ProductsPerStep } from "@/app/constants/types/types";
import { Steps } from "@/app/constants/enums/enums";
import Placeholder from "@/public/assets/images/placeholder.webp";
import Counter from "../counter/counter";

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
  { step: Steps.sensors, label: "Sensors" },
  { step: Steps.accessories, label: "Accessories" },
  { step: Steps.plans, label: "Plan" },
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
    <div className="bg-primary-foreground xl:rounded-base flex h-full flex-col">
      <p className="text-label px-15px pt-15px pb-1 text-xs font-medium tracking-widest uppercase">
        Review
      </p>
      <div className="p-5">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-secondary text-28px xl:text-22px font-semibold">
            Your security system
          </h2>
          <p className="text-secondary-foreground text-base xl:text-sm">
            Review your personalized protection system designed to keep what
            matters most safe.
          </p>
        </div>

        {/* Empty state */}
        {/* {isEmpty && (
          <div className="flex items-center justify-center">
            <p className="text-secondary-muted text-center text-sm">
              No products selected yet.
              <br />
              Start building your system.
            </p>
          </div>
        )} */}

        {/* Line item sections */}
        {!isEmpty && (
          <div className="space-y-4">
            {SECTIONS.map(({ step, label }) => {
              const items = lineItems.filter(
                (item) => item.product.step === step,
              );
              if (items.length === 0) return null;

              return (
                <div key={step}>
                  {/* Section label */}
                  <p className="text-secondary-muted pt-15px border-border-muted border-t text-xs tracking-widest uppercase">
                    {label}
                  </p>

                  <div>
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
                          className="flex items-center justify-between py-2.5"
                        >
                          <div className="flex items-center gap-3">
                            {/* Product image */}
                            <div className="rounded-half-base relative h-9 w-9 bg-white">
                              <Image
                                src={item.image || Placeholder}
                                alt={item.product.name}
                                fill
                                className="object-contain"
                              />
                            </div>

                            {/* Name */}
                            <div className="min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  isPlan
                                    ? "text-primary font-semibold"
                                    : "text-secondary-heading"
                                }`}
                              >
                                {item.product.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Counter — only for non-plan / non-shipping items */}
                            {!isPlan && !isShipping && (
                              <Counter
                                counterVariant="orderReview"
                                disabledAt={item.product.required ? 1 : 0}
                                increment={() =>
                                  handleIncrement(item.id, item.variantLabel)
                                }
                                decrement={() =>
                                  handleDecrement(
                                    item.id,
                                    item.variantLabel,
                                    item.product.required,
                                  )
                                }
                                count={item.count}
                              />
                            )}

                            {/* Price column */}
                            <div className="text-right">
                              {isFree ? (
                                <>
                                  {hasDiscount && (
                                    <p className="text-price text-sm leading-none font-medium line-through">
                                      $
                                      {(
                                        item.product.price * item.count
                                      ).toFixed(2)}
                                    </p>
                                  )}
                                  <p className="text-primary text-sm font-semibold">
                                    FREE
                                  </p>
                                </>
                              ) : (
                                <>
                                  {hasDiscount && (
                                    <p className="text-price text-sm leading-none font-medium line-through">
                                      $
                                      {(
                                        item.product.price * item.count
                                      ).toFixed(2)}
                                      {isPerMonth ? "/mo" : ""}
                                    </p>
                                  )}
                                  <p className="text-primary text-sm font-semibold">
                                    ${(displayPrice * item.count).toFixed(2)}
                                    {isPerMonth && (
                                      <span className="text-sm font-semibold">
                                        /mo
                                      </span>
                                    )}
                                  </p>
                                </>
                              )}
                            </div>
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
          <div className="border-border-muted/50 mt-5 space-y-3">
            {/* "as low as" badge + totals */}

            <div className="flex items-end justify-between">
              <Image
                src="/assets/images/satisfaction-badge.png"
                alt="satisfaction"
                width={78}
                height={78}
                className="object-cover"
              />
              <div className="flex flex-col items-end gap-2">
                {/* Right — total */}
                {monthlyPrice !== undefined && (
                  <span className="bg-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    as low as ${monthlyPrice?.toFixed(2)}/mo
                  </span>
                )}
                <div className="flex items-end gap-2">
                  {" "}
                  {hasSavings && (
                    <p className="text-price text-lg line-through">
                      ${totalOriginal.toFixed(2)}
                    </p>
                  )}
                  <p className="text-primary text-2xl font-bold">
                    ${totalDiscounted.toFixed(2)}
                  </p>
                </div>
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
    </div>
  );
}
