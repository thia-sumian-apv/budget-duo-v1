"use client";

import { Pencil, Trash2, ChevronDown, ChevronUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowTypeBadge, type FlowType } from "./FlowTypeLegend";
import { formatCurrency } from "@/lib/utils/budget";
import type { GetPlannerQuery } from "../Planner.api";

type Goal = NonNullable<GetPlannerQuery["getPlanner"]>["goals"][0];

interface Contributions {
  current: number;
  partner: number;
  isShared: boolean;
}

interface Ratios {
  currentRatio: number;
  partnerRatio: number;
}

interface GoalListItemProps {
  goal: Goal;
  isExpanded: boolean;
  onToggleExpand: () => void;
  canEdit: boolean;
  hasPartner: boolean;
  contributions: Contributions;
  ratios: Ratios;
  currentName: string;
  partnerName: string;
  ownerLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-SG", {
    month: "short",
    year: "numeric",
  });
};

export const GoalListItem = ({
  goal,
  isExpanded,
  onToggleExpand,
  canEdit,
  hasPartner,
  contributions,
  ratios,
  currentName,
  partnerName,
  ownerLabel,
  onEdit,
  onDelete,
  isDeleting,
}: GoalListItemProps) => {
  return (
    <div className="rounded-xl border border-navy/10 bg-white/60 overflow-hidden">
      {/* Main Row */}
      <div className="p-4 flex items-center gap-3">
        <FlowTypeBadge type={goal.flowType as FlowType} />

        <div className="flex-1 min-w-0">
          <p className="font-medium text-navy truncate">{goal.name}</p>
          <p className="text-xs text-navy/50">
            {ownerLabel}
            {goal.isCpfEligible && " • CPF eligible"}
          </p>
        </div>

        <div className="text-right">
          <p className="font-bold text-navy">
            {formatCurrency(goal.monthlyAmount)}
            <span className="text-xs text-navy/50 font-normal">/mo</span>
          </p>
          {goal.duration && (
            <p className="text-xs text-navy/50">{goal.duration} months</p>
          )}
        </div>

        <button
          onClick={onToggleExpand}
          className="p-1 text-navy/40 hover:text-navy/60"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-navy/10">
          <div className="pt-3 space-y-2 text-sm">
            {/* Per-person contribution breakdown */}
            {hasPartner && (
              <div className="rounded-lg bg-navy/5 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-navy/60 mb-2">
                  <Users className="h-3.5 w-3.5" />
                  <span>Per-person contribution</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/70">{currentName}</span>
                  <span
                    className={`font-medium ${
                      contributions.current > 0 ? "text-highlight" : "text-navy/40"
                    }`}
                  >
                    {formatCurrency(contributions.current)}/mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/70">{partnerName}</span>
                  <span
                    className={`font-medium ${
                      contributions.partner > 0 ? "text-navy" : "text-navy/40"
                    }`}
                  >
                    {formatCurrency(contributions.partner)}/mo
                  </span>
                </div>
                {contributions.isShared && (
                  <p className="text-xs text-navy/50 pt-1 border-t border-navy/10">
                    Split {Math.round(ratios.currentRatio * 100)}% /{" "}
                    {Math.round(ratios.partnerRatio * 100)}%
                  </p>
                )}
              </div>
            )}

            {goal.category === "GOAL" && (
              <>
                <div className="flex justify-between">
                  <span className="text-navy/60">Total Amount</span>
                  <span className="text-navy">
                    {formatCurrency(goal.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/60">Duration</span>
                  <span className="text-navy">{goal.duration} months</span>
                </div>
                {goal.startDate && (
                  <div className="flex justify-between">
                    <span className="text-navy/60">Period</span>
                    <span className="text-navy">
                      {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                    </span>
                  </div>
                )}
              </>
            )}

            {goal.isCpfEligible && (
              <div className="flex justify-between">
                <span className="text-navy/60">CPF Eligible</span>
                <span className="text-purple-600 font-medium">
                  Yes (OA can be used)
                </span>
              </div>
            )}

            {goal.remarks && (
              <div className="pt-2 border-t border-navy/10">
                <p className="text-navy/60 text-xs mb-1">Notes</p>
                <p className="text-navy">{goal.remarks}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3">
              {canEdit && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onEdit}
                    className="h-8 rounded-full"
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="h-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
