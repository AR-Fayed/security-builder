import Accordion from "./components/accordion/accordion";

export default function Home() {
  return (
    <main className="grid gap-7 px-[122px] py-[49px] xl:grid-cols-3">
      {/* Builder Column */}
      <div className="xl:col-span-2">
        <Accordion
          step={1}
          defaultOpen
          title="Choose your cameras"
          icon="assets/icons/livestream-icon.svg"
        >
          <div className="overflow-hidden">
            <div className="mt-[15px]">
              <div>haw haw</div>
              <div>haw haw</div>
              <div>haw haw</div>
            </div>
          </div>
        </Accordion>
      </div>

      {/* Review Column */}
      <div className="bg-primary-foreground rounded-base px-16 py-16 xl:col-span-1">
        <h1 className="font-bold text-black">Review Your Build</h1>
      </div>
    </main>
  );
}
