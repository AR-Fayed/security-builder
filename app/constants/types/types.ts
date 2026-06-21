import { Steps } from "../enums/enums";

export type StepValue = (typeof Steps)[keyof typeof Steps]; // 1 | 2 | 3 | 4

export type ProductsPerStep = {
  id: string;
  step: StepValue;
  count: number;
  variantLabel: string;
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
  masterImage: string;
  variants: Variant[];
};
