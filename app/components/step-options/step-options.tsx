"use client";

import { Steps, StepsIcons, StepsTitle } from "@/app/constants/enums/enums";
import Accordion from "../accordion/accordion";
import { useState } from "react";
import ProductCard from "../product-card/product-card";
import { ProductsPerStep } from "@/app/constants/types/types";

export default function StepOptions() {
  const [selectedStep, setSelectedStep] = useState<Steps | 0>(Steps.cameras);

  const [selectedCounts, setSelectedCounts] = useState<ProductsPerStep[]>([
    { step: Steps.cameras, count: 0 },
    { step: Steps.plans, count: 0 },
    { step: Steps.sensors, count: 0 },
    { step: Steps.accessories, count: 0 },
  ]);

  return (
    <div>
      <Accordion
        selectedCount={
          selectedCounts.find((c) => c.step === Steps.cameras)?.count
        }
        step={Steps.cameras}
        actionBtnLabel={`Next: ${StepsTitle.plans}`}
        title={StepsTitle.cameras}
        icon={StepsIcons.cameras}
        actionBtnHandler={() => {
          setSelectedStep(Steps.plans);
        }}
        open={selectedStep === Steps.cameras}
        onToggle={() => {
          setSelectedStep((prev) =>
            prev === Steps.cameras ? 0 : Steps.cameras,
          );
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-15px flex">
            <ProductCard
              step={Steps.cameras}
              setSelectedCount={setSelectedCounts}
              name="Wyze Cam v4"
              description="The clearest Wyze Cam ever made."
              originalPrice={35.98}
              discountedPrice={27.98}
              savePercent={22}
              variants={[
                {
                  label: "White",
                  image: "/assets/images/wyze-cam-v4-white.png",
                  count: 1,
                },
                {
                  label: "Grey",
                  image: "/assets/images/wyze-cam-v4-grey.png",
                  count: 0,
                },
                {
                  label: "Black",
                  image: "/assets/images/wyze-cam-v4-black.png",
                  count: 0,
                },
              ]}
            />
          </div>
        </div>
      </Accordion>

      <Accordion
        step={Steps.plans}
        actionBtnLabel={`Next: ${StepsTitle.sensors}`}
        title={StepsTitle.plans}
        icon={StepsIcons.plans}
        actionBtnHandler={() => {
          setSelectedStep(Steps.sensors);
        }}
        open={selectedStep === Steps.plans}
        onToggle={() => {
          setSelectedStep((prev) => (prev === Steps.plans ? 0 : Steps.plans));
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-15px">
            <p>test</p>
            <p>test</p>
            <p>test</p>
          </div>
        </div>
      </Accordion>

      <Accordion
        step={Steps.sensors}
        actionBtnLabel={`Next: ${StepsTitle.accessories}`}
        title={StepsTitle.sensors}
        icon={StepsIcons.sensors}
        actionBtnHandler={() => {
          setSelectedStep(Steps.accessories);
        }}
        open={selectedStep === Steps.sensors}
        onToggle={() => {
          setSelectedStep((prev) =>
            prev === Steps.sensors ? 0 : Steps.sensors,
          );
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-15px">
            <p>test</p>
            <p>test</p>
            <p>test</p>
          </div>
        </div>
      </Accordion>

      <Accordion
        step={Steps.accessories}
        actionBtnLabel={`Done`}
        title={StepsTitle.accessories}
        icon={StepsIcons.accessories}
        actionBtnHandler={() => {
          setSelectedStep(0);
        }}
        open={selectedStep === Steps.accessories}
        onToggle={() => {
          setSelectedStep((prev) =>
            prev === Steps.accessories ? 0 : Steps.accessories,
          );
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-15px">
            <p>test</p>
            <p>test</p>
            <p>test</p>
          </div>
        </div>
      </Accordion>
    </div>
  );
}
