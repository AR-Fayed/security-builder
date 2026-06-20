"use client";

import { Steps, StepsIcons, StepsTitle } from "@/app/constants/enums/enums";
import Accordion from "../accordion/accordion";
import { useState } from "react";
import ProductCard from "../product-card/product-card";
import { Product, ProductsPerStep } from "@/app/constants/types/types";

export default function StepOptions({ products }: { products: Product[] }) {
  const [selectedStep, setSelectedStep] = useState<Steps | 0>(Steps.cameras);
  const [selectedCounts, setSelectedCounts] = useState<ProductsPerStep[]>([
    { step: Steps.cameras, count: 0, total: 0 },
    { step: Steps.plans, count: 0, total: 0 },
    { step: Steps.sensors, count: 0, total: 0 },
    { step: Steps.accessories, count: 0, total: 0 },
  ]);

  const step1Products = products.filter((p) => p.step === Steps.cameras);
  const step2Products = products.filter((p) => p.step === Steps.plans);
  const step3Products = products.filter((p) => p.step === Steps.sensors);
  const step4Products = products.filter((p) => p.step === Steps.accessories);

  return (
    <div className="space-y-13px">
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
          <div className="mt-15px gap-15px flex flex-wrap justify-center">
            {step1Products.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  step={product.step}
                  setSelectedCount={setSelectedCounts}
                  name={product.name}
                  description={product.description}
                  originalPrice={product.price}
                  discountedPrice={product.discountedPrice}
                  savePercent={product.discount}
                  variants={product.variants}
                />
              );
            })}
          </div>
        </div>
      </Accordion>

      <Accordion
        selectedCount={
          selectedCounts.find((c) => c.step === Steps.plans)?.count
        }
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
            {step2Products.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  step={product.step}
                  setSelectedCount={setSelectedCounts}
                  name={product.name}
                  description={product.description}
                  originalPrice={product.price}
                  discountedPrice={product.discountedPrice}
                  savePercent={product.discount}
                  variants={product.variants}
                />
              );
            })}
          </div>
        </div>
      </Accordion>

      <Accordion
        selectedCount={
          selectedCounts.find((c) => c.step === Steps.sensors)?.count
        }
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
            {step3Products.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  step={product.step}
                  setSelectedCount={setSelectedCounts}
                  name={product.name}
                  description={product.description}
                  originalPrice={product.price}
                  discountedPrice={product.discountedPrice}
                  savePercent={product.discount}
                  variants={product.variants}
                />
              );
            })}
          </div>
        </div>
      </Accordion>

      <Accordion
        selectedCount={
          selectedCounts.find((c) => c.step === Steps.accessories)?.count
        }
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
            {step4Products.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  step={product.step}
                  setSelectedCount={setSelectedCounts}
                  name={product.name}
                  description={product.description}
                  originalPrice={product.price}
                  discountedPrice={product.discountedPrice}
                  savePercent={product.discount}
                  variants={product.variants}
                />
              );
            })}
          </div>
        </div>
      </Accordion>
    </div>
  );
}
