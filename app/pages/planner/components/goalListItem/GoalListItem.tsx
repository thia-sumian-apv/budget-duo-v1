"use client";

import { cn } from "@/lib/utils";
import { GoalSummaryRow } from "./GoalSummaryRow";
import { ContributionBreakdown } from "./ContributionBreakdown";
import { GoalDetails } from "./GoalDetails";
import { GoalActions } from "./GoalActions";
import type { GoalListItemProps } from "./types";

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
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-navy/10 overflow-hidden transition-all duration-300 hover:border-highlight/30 cursor-pointer group",
        isExpanded && "ring-2 ring-highlight/30 border-highlight/30",
      )}
      onClick={onToggleExpand}
    >
      <GoalSummaryRow goal={goal} ownerLabel={ownerLabel} />

      {isExpanded && (
        <div
          className="px-5 pb-5 pt-2 border-t border-navy/10 bg-gray-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mt-4 space-y-4">
            <ContributionBreakdown
              contributions={contributions}
              ratios={ratios}
              currentName={currentName}
              partnerName={partnerName}
              hasPartner={hasPartner}
            />

            <GoalDetails goal={goal} />

            {canEdit && (
              <GoalActions
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
