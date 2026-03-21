"use client";

import { formatCurrency } from "@/lib/utils/budget";
import { getMemberName } from "@/lib/utils/member";
import type { PlannerMember, IncomeBasedData } from "./types";

const BAR_COLORS = ["bg-highlight", "bg-teal-500"];

interface IncomeBasedDisplayProps {
  members: PlannerMember[];
  currentUserId: string | null;
  incomeBased: IncomeBasedData;
}

export const IncomeBasedDisplay = ({
  members,
  currentUserId,
  incomeBased,
}: IncomeBasedDisplayProps) => {
  return (
    <div className="space-y-6">
      {members.map((member, index) => {
        const isCurrentUser = member.user.id === currentUserId;
        const percentage = isCurrentUser
          ? incomeBased.current
          : incomeBased.partner;
        const name = getMemberName(member, "Member");

        return (
          <div key={member.user.id}>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-navy">
                {name}&apos;s Share ({percentage.toFixed(0)}%)
              </span>
              <span className="text-sm font-semibold text-navy/60">
                {formatCurrency((incomeBased.total * percentage) / 100)}
              </span>
            </div>
            <div className="w-full h-3 bg-navy/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${BAR_COLORS[index % BAR_COLORS.length]} rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="mt-8 pt-6 border-t border-navy/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-navy/60">Total Shared Pool</span>
          <span className="text-xl font-black text-navy">
            {formatCurrency(incomeBased.total)}
          </span>
        </div>
      </div>
    </div>
  );
};
