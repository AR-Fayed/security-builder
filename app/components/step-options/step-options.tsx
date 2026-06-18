"use client";

import { Steps, StepsIcons, StepsTitle } from "@/app/constants/enums/enums";
import Accordion from "../accordion/accordion";
import { useState } from "react";

export default function StepOptions() {
  const [selectedStep, setSelectedStep] = useState<Steps | 0>(Steps.cameras);

  return (
    <div>
      <Accordion
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
          <div className="mt-[15px]">
            <p>test</p>
            <p>test</p>
            <p>test</p>
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
          <div className="mt-[15px]">
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
          <div className="mt-[15px]">
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
