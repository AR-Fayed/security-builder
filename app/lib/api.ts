import { Product } from "../constants/types/types";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products");
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}
