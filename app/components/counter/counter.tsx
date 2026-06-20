import { Minus, Plus } from "lucide-react";

type Props = {
  selectedVariant: number;
  counts: { label: string; count: number }[];
  increment: () => void;
  decrement: () => void;
};

export default function Counter({
  selectedVariant,
  counts,
  increment,
  decrement,
}: Props) {
  return (
    <div className="flex items-center gap-2.5 p-1.5">
      <button
        onClick={decrement}
        className={`${counts[selectedVariant].count === 0 ? "text-counter-muted border-counter-muted" : "text-label bg-background-counter hover:text-primary border-background-counter"} rounded-sm border-2 p-0.5 transition-all`}
      >
        <Minus size={14} />
      </button>
      <span className="text-secondary-heading w-4 text-center font-medium">
        {counts[selectedVariant].count}
      </span>
      <button
        onClick={increment}
        className="text-label bg-background-counter border-background-counter hover:text-primary rounded-sm border-2 p-0.5"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
