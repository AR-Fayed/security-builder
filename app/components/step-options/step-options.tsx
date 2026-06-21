"use client";

import { Steps, StepsIcons, StepsTitle } from "@/app/constants/enums/enums";
import Accordion from "../accordion/accordion";
import { useState } from "react";
import ProductCard from "../product-card/product-card";
import { Product, ProductsPerStep } from "@/app/constants/types/types";

type Props = {
  products: Product[];
  selectedProducts: ProductsPerStep[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductsPerStep[]>>;
};

export default function StepOptions({
  products,
  selectedProducts,
  setSelectedProducts,
}: Props) {
  const [selectedStep, setSelectedStep] = useState<Steps>(Steps.cameras);

  const cameraStepProducts = products.filter((p) => p.step === Steps.cameras);
  const cameraStepCount = new Set(
    selectedProducts.filter((p) => p.step === Steps.cameras).map((p) => p.id),
  ).size;

  const planStepProducts = products.filter((p) => p.step === Steps.plans);
  const planStepCount = new Set(
    selectedProducts.filter((p) => p.step === Steps.plans).map((p) => p.id),
  ).size;

  const sensorStepProducts = products.filter((p) => p.step === Steps.sensors);
  const sensorStepCount = new Set(
    selectedProducts.filter((p) => p.step === Steps.sensors).map((p) => p.id),
  ).size;

  const accessoryStepProducts = products.filter(
    (p) => p.step === Steps.accessories,
  );
  const accessoryStepCount = new Set(
    selectedProducts
      .filter((p) => p.step === Steps.accessories)
      .map((p) => p.id),
  ).size;

  return (
    <div className="space-y-13px">
      <Accordion
        selectedCount={cameraStepCount}
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
          <div className="mt-15px gap-15px flex flex-wrap justify-center">
            {cameraStepProducts.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  product={product}
                />
              );
            })}
          </div>
        </div>
      </Accordion>

      <Accordion
        selectedCount={planStepCount}
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
          <div className="mt-15px gap-15px flex flex-wrap justify-center">
            {planStepProducts.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  product={product}
                />
              );
            })}
          </div>
        </div>
      </Accordion>

      <Accordion
        selectedCount={sensorStepCount}
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
          <div className="mt-15px gap-15px flex flex-wrap justify-center">
            {sensorStepProducts.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  product={product}
                />
              );
            })}
          </div>
        </div>
      </Accordion>

      <Accordion
        selectedCount={accessoryStepCount}
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
          <div className="mt-15px gap-15px flex flex-wrap justify-center">
            {accessoryStepProducts.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  product={product}
                />
              );
            })}
          </div>
        </div>
      </Accordion>
    </div>
  );
}
