import { Check } from "lucide-react";
import type { WizardStep } from "./wizardReducer";

const STEPS: { key: WizardStep; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "income", label: "Income" },
  { key: "breakdown", label: "Breakdown" },
  { key: "complete", label: "Summary" },
];

interface StepIndicatorProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
}

export const StepIndicator = ({ currentStep, onStepClick }: StepIndicatorProps) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isClickable = isCompleted && !!onStepClick;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.key)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-highlight text-white"
                    : isActive
                    ? "bg-highlight text-white ring-4 ring-highlight/20"
                    : "bg-navy/10 text-navy/40"
                } ${isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </button>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  index <= currentIndex ? "text-highlight" : "text-navy/30"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-10 h-0.5 mb-4 transition-colors ${
                  isCompleted ? "bg-highlight" : "bg-navy/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
