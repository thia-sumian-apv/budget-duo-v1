"use client";

import { formatCurrency } from "@/lib/utils/budget";

interface MemberSummaryCardProps {
  name: string;
  initial: string;
  remaining: number;
  isCurrentUser?: boolean;
}

export const MemberSummaryCard = ({
  name,
  initial,
  remaining,
  isCurrentUser = false,
}: MemberSummaryCardProps) => {
  return (
    <div className="rounded-xl border border-navy/10 bg-white/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isCurrentUser ? "bg-highlight/20" : "bg-navy/10"
          }`}
        >
          <span
            className={`text-xs font-bold ${
              isCurrentUser ? "text-highlight" : "text-navy/70"
            }`}
          >
            {initial}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-navy">{name}</p>
          <p className="text-xs text-navy/50">
            {isCurrentUser ? "You" : "Partner"}
          </p>
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-navy/60">Remaining</span>
        <span
          className={`text-lg font-bold ${
            remaining >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatCurrency(remaining)}
        </span>
      </div>
    </div>
  );
};
