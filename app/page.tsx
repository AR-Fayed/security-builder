import StepOptions from "./components/step-options/step-options";

export default function Home() {
  return (
    <main className="px-122px py-49px grid gap-7 xl:grid-cols-3">
      {/* Builder Column */}
      <div className="xl:col-span-2">
        <StepOptions />
      </div>

      {/* Review Column */}
      <div className="bg-primary-foreground rounded-base px-16 py-16 xl:col-span-1">
        <h1 className="font-bold text-black">Review Your Build</h1>
      </div>
    </main>
  );
}
