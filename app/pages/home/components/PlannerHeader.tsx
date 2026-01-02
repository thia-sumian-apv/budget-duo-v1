"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { formatPlannerCode } from "@/lib/utils/plannerCode";
import type { ExpandedPlannerState } from "../homeTypes";

interface PlannerHeaderProps {
  planner: ExpandedPlannerState;
  onBack: () => void;
}

export const PlannerHeader = ({ planner, onBack }: PlannerHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(planner.plannerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-highlight/40 bg-highlight/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg p-1.5 hover:bg-navy/10 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-semibold text-navy">
              {planner.plannerName}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-navy/50">
                Code: {formatPlannerCode(planner.plannerCode)}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="text-navy/50 hover:text-navy/70 transition"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
