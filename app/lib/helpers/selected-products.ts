import {
  Product,
  ProductsPerStep,
  StepValue,
} from "@/app/constants/types/types";

export function getDefaults(products: Product[]): ProductsPerStep[] {
  // Pre-select required products (e.g. Wyze Sense Hub) so they appear in the review from the start.
  const required = products
    .filter((product) => product.required && product.variants.length > 0)
    .map((product) => ({
      id: product.id,
      step: product.step as StepValue,
      count: 1,
      variantLabel: product.variants[0].label,
    }));

  // Pre-select shipping products (step 5) — they have no accordion UI.
  const shipping = products
    .filter((p) => p.step === 5)
    .map((p) => ({
      id: p.id,
      step: p.step as StepValue,
      count: 1,
      variantLabel: p.variants.length > 0 ? p.variants[0].label : p.name,
    }));

  return [...required, ...shipping];
}

export function getInitialProducts(products: Product[]): ProductsPerStep[] {
  // Server-side: window doesn't exist, skip localStorage and return defaults.
  if (typeof window === "undefined") return getDefaults(products);

  // Client-side: read directly in the initializer — no effect, no extra render.
  try {
    const saved = localStorage.getItem("selected-bundle");
    if (!saved) return getDefaults(products);

    const parsed = JSON.parse(saved) as Array<{
      id: string;
      step: StepValue;
      count: number;
      variantLabel: string;
    }>;

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(({ id, step, count, variantLabel }) => ({
        id,
        step,
        count,
        variantLabel,
      }));
    }
  } catch {
    // Corrupted data — fall through to defaults.
  }

  return getDefaults(products);
}
