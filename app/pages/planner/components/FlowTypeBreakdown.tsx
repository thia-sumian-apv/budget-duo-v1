"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FlowTypeLegend, FLOW_TYPE_COLORS, type FlowType } from "./FlowTypeLegend";
import { formatCurrency } from "@/lib/utils/budget";
import type { GetPlannerQuery } from "../Planner.api";

type Goal = NonNullable<GetPlannerQuery["getPlanner"]>["goals"][0];

interface FlowTypeBreakdownProps {
  flowTypeTotals: Record<FlowType, number>;
  goalsByFlowType: Record<FlowType, Goal[]>;
  combinedTakeHome: number;
  currentUserId: string | null;
  partnerName: string;
}

export const FlowTypeBreakdown = ({
  flowTypeTotals,
  goalsByFlowType,
  combinedTakeHome,
  currentUserId,
  partnerName,
}: FlowTypeBreakdownProps) => {
  const [expandedFlowType, setExpandedFlowType] = useState<FlowType | null>(null);

  const getOwnerLabel = (goal: Goal) => {
    if (goal.ownerType === "SHARED") return "Shared";
    if (goal.owner?.id === currentUserId) return "Yours";
    return partnerName;
  };

  return (
    <div className="rounded-xl border border-navy/10 bg-white/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-navy">
          Monthly Allocations
        </h3>
        <FlowTypeLegend compact />
      </div>

      <div className="space-y-2">
        {(["EXPENSE", "SAVINGS", "INVESTMENT"] as FlowType[]).map((type) => {
          const amount = flowTypeTotals[type];
          const percentage =
            combinedTakeHome > 0 ? (amount / combinedTakeHome) * 100 : 0;
          const colors = FLOW_TYPE_COLORS[type];
          const goalsForType = goalsByFlowType[type];
          const isExpanded = expandedFlowType === type;
          const hasGoals = goalsForType.length > 0;

          return (
            <div
              key={type}
              className="rounded-lg border border-navy/5 overflow-hidden"
            >
              <button
                onClick={() =>
                  hasGoals && setExpandedFlowType(isExpanded ? null : type)
                }
                disabled={!hasGoals}
                className={`w-full flex items-center gap-3 p-3 ${
                  hasGoals ? "hover:bg-navy/5 cursor-pointer" : "cursor-default"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                <span className="text-sm text-navy/70 w-24 text-left">
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </span>
                <div className="flex-1 h-2 bg-navy/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.dot} transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-navy w-20 text-right">
                  {formatCurrency(amount)}
                </span>
                {hasGoals && (
                  <span className="text-navy/40">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                )}
                {!hasGoals && <span className="w-4" />}
              </button>

              {isExpanded && hasGoals && (
                <div className="px-3 pb-3 pt-1 border-t border-navy/5 bg-navy/[0.02]">
                  <div className="space-y-2">
                    {goalsForType.map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between py-1.5 text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-navy truncate">{goal.name}</p>
                          <p className="text-xs text-navy/50">
                            {getOwnerLabel(goal)}
                          </p>
                        </div>
                        <span className="font-medium text-navy ml-3">
                          {formatCurrency(goal.monthlyAmount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-navy/40 mt-2 pt-2 border-t border-navy/5">
                    {goalsForType.length} item
                    {goalsForType.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
