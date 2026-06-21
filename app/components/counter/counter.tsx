import { Minus, Plus } from "lucide-react";

type Props = {
  counterVariant?: "productCard" | "orderReview";
  selectedVariant?: number;
  variantCounts?: { label: string; count: number }[];
  increment: () => void;
  decrement: () => void;
  disabledAt?: number;
  count?: number;
};

export default function Counter({
  selectedVariant,
  variantCounts,
  increment,
  decrement,
  disabledAt = 0,
  count,
  counterVariant = "productCard",
}: Props) {
  const displayCount =
    count !== undefined
      ? count
      : variantCounts !== undefined && selectedVariant !== undefined
        ? variantCounts[selectedVariant].count
        : 0;

  // Decrement is disabled when the displayed count is at the floor value
  const isAtFloor = displayCount === disabledAt;
  const isProductCard = counterVariant === "productCard";

  // Keep every class as a complete static string so Tailwind v4's scanner picks them up
  const decrementCss = isAtFloor
    ? isProductCard
      ? "text-counter-muted border-counter-muted"
      : "text-label border-muted opacity-50"
    : isProductCard
      ? "text-label hover:text-primary border-background-counter bg-background-counter"
      : "text-label hover:text-primary border-white bg-white";

  const incrementCss = isProductCard
    ? "text-label bg-background-counter border-background-counter hover:text-primary"
    : "text-label border-white bg-white hover:text-primary";

  return (
    <div className="flex items-center gap-2.5 p-1.5">
      <button
        onClick={decrement}
        disabled={isAtFloor}
        className={`${decrementCss} rounded-sm border-2 p-0.5 transition-all`}
      >
        <Minus size={14} />
      </button>
      <span className="text-secondary-heading w-4 text-center font-medium">
        {displayCount}
      </span>
      <button
        onClick={increment}
        className={`${incrementCss} rounded-sm border-2 p-0.5`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
