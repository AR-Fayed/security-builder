"use client";

import Accordion from "../accordion/accordion";
import { useState } from "react";

export default function StepOptions() {
  enum steps {
    cameras = 1,
    plans = 2,
  }
  const [selectedStep, setSelectedStep] = useState<steps | 0>(steps.cameras);

  return (
    <div>
      <Accordion
        step={steps.cameras}
        actionBtnLabel="Next: Choose your plan"
        title="Choose your cameras"
        icon="assets/icons/livestream-icon.svg"
        actionBtnHandler={() => {
          setSelectedStep(steps.plans);
        }}
        open={selectedStep === steps.cameras}
        onToggle={() => {
          setSelectedStep((prev) =>
            prev === steps.cameras ? 0 : steps.cameras,
          );
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-[15px]">
            <p>test</p>
            <p>test</p>
            <p>test</p>
          </div>
        </div>
      </Accordion>
      <Accordion
        step={steps.plans}
        actionBtnLabel="Next: Choose your Camera"
        title="Choose your plans"
        icon="assets/icons/sheild-icon.svg"
        actionBtnHandler={() => {
          setSelectedStep(steps.cameras);
        }}
        open={selectedStep === steps.plans}
        onToggle={() => {
          setSelectedStep((prev) => (prev === steps.plans ? 0 : steps.plans));
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-[15px]">
            <p>test</p>
            <p>test</p>
            <p>test</p>
          </div>
        </div>
      </Accordion>
    </div>
  );
}
