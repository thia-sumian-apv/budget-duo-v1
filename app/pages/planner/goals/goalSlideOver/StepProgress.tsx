"use client";

import type { FormStep } from "./types";

interface StepProgressProps {
  step: FormStep;
}

export const StepProgress = ({ step }: StepProgressProps) => (
  <div className="flex items-center gap-4 mb-8">
    <div
      className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-highlight" : "bg-gray-200"}`}
    />
    <div
      className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-highlight" : "bg-gray-200"}`}
    />
  </div>
);
