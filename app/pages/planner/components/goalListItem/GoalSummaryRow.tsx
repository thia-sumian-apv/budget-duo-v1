"use client";

import { Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils/budget";
import { FlowTypeBadge } from "./FlowTypeBadge";
import type { Goal } from "./types";

interface GoalSummaryRowProps {
  goal: Goal;
  ownerLabel: string;
}

export const GoalSummaryRow = ({ goal, ownerLabel }: GoalSummaryRowProps) => {
  return (
    <div className="p-5 flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <FlowTypeBadge flowType={goal.flowType} />
          <h3 className="font-bold text-lg text-navy leading-tight">
            {goal.name}
          </h3>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm text-navy/60 flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {ownerLabel}
          </span>
          {goal.isCpfEligible && (
            <span className="bg-teal-500/10 text-teal-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
              CPF ELIGIBLE
            </span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-2xl font-black text-navy">
          {formatCurrency(goal.monthlyAmount)}
        </p>
        <p className="text-xs text-navy/60 font-medium uppercase mt-1">
          {goal.category === "GOAL" ? "Monthly Target" : "Monthly Payment"}
        </p>
      </div>
    </div>
  );
};
