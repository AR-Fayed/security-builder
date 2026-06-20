import { Steps } from "../enums/enums";

export type StepValue = (typeof Steps)[keyof typeof Steps]; // 1 | 2 | 3 | 4

export type ProductsPerStep = {
  step: StepValue;
  count: number; // distinct products with qty > 0
  total: number; // sum of all quantities
};

export type Variant = {
  label: string;
  image?: string;
  count: number;
};

export type Product = {
  id: string;
  step: number;
  name: string;
  description: string;
  required: boolean;
  discount: number | null;
  price: number;
  discountedPrice: number | null;
  learnMoreUrl: string;
  variants: Variant[];
};
