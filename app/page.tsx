export default function Home() {
  return (
    <main className="grid grid-cols-3 gap-4 px-[122px] py-[49px]">
      {/* Builder Column */}
      <div className="bg-panel-background rounded-base col-span-2 px-20 py-16">
        <h1 className="font-medium text-black">Choose your cameras</h1>
      </div>

      {/* Review Column */}
      <div className="bg-panel-background rounded-base col-span-1 px-16 py-16">
        <h1 className="font-bold text-black">Review Your Build</h1>
      </div>
    </main>
  );
}
