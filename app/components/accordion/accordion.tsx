"use client";
import { Triangle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  icon: string;
  step: number;
  defaultOpen?: boolean;
};

export default function Accordion({
  children,
  defaultOpen,
  title,
  step,
  icon,
}: Props) {
  const [open, setOpen] = useState(defaultOpen ? true : false);

  return (
    <div
      className={`mt-[13px] transition-all duration-300 ease-in-out ${open ? "rounded-base bg-primary-foreground" : ""}`}
    >
      {/* Step header */}
      <p
        className={`border-secondary border-0.5 text-label border-b px-[15px] pt-[13px] transition-all duration-300 ease-in-out ${open ? "text-xs" : "text-[10px]"} font-medium`}
      >
        STEP {step} OF 4
      </p>

      <div className="px-[15px] py-5">
        {/* Step title and Selected Count */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between"
        >
          <h2 className="text-secondary-heading flex items-center gap-2 text-[22px] font-semibold">
            <span>
              {" "}
              <Image src={icon} alt="" width={26} height={26} />
            </span>
            {title}
          </h2>

          <div className="text-primary flex items-center gap-2 text-sm font-medium">
            <p
              className={`transition-all duration-300 ease-in-out ${open ? "" : "opacity-0"}`}
            >
              2 selected
            </p>
            <Triangle
              className={`transition-all duration-300 ease-in-out ${open ? "" : "rotate-180"}`}
              size={12}
              fill="currentColor"
            />
          </div>
        </button>

        {/* Accordion body */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          {children}
        </div>
      </div>

      {/* Bottom border */}
      <hr
        className={`border-0.5 border-secondary transition-all duration-300 ease-in-out ${open ? "opacity-0" : ""}`}
      />
    </div>
  );
}
