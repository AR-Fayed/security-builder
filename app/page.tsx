import Builder from "./components/builder/builder";
import { getProducts } from "./lib/api";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="xl:px-122px xl:py-49px grid gap-5 py-8 xl:grid-cols-3 xl:gap-7">
      <h1 className="text-secondary text-32px text-center font-bold xl:hidden">
        Let&#39;s get started!
      </h1>

      <Builder products={products} />
    </main>
  );
}
