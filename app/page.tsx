import StepOptions from "./components/step-options/step-options";
import { getProducts } from "./lib/api";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="xl:px-122px xl:py-49px grid gap-5 py-8 xl:grid-cols-3 xl:gap-7">
      <h1 className="text-secondary text-32px text-center font-bold xl:hidden">
        Let&#39;s get started!
      </h1>

      {/* Builder Column */}
      <div className="xl:col-span-2">
        <StepOptions products={products} />
      </div>

      {/* Review Column */}
      <div className="bg-primary-foreground rounded-base px-16 py-16 xl:col-span-1">
        <h1 className="font-bold text-black">Review Your Build</h1>
      </div>
    </main>
  );
}
