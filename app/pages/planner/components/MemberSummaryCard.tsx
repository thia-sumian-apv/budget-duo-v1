"use client";

import { formatCurrency } from "@/lib/utils/budget";
import { AvatarCircle } from "@/components/ui/avatar-circle";

interface MemberSummaryCardProps {
  name: string;
  initial: string;
  remaining: number;
  isCurrentUser?: boolean;
  contributionPercent?: number;
}

export const MemberSummaryCard = ({
  initial,
  remaining,
  isCurrentUser = false,
  contributionPercent,
}: MemberSummaryCardProps) => {
  const shareLabel =
    contributionPercent != null
      ? `${Math.round(contributionPercent)}% Share`
      : "—";

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-navy/10 flex flex-col justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <AvatarCircle
          initial={initial}
          variant={isCurrentUser ? "highlight" : "cyan"}
          size="lg"
        />
        <div>
          <p className="text-xs font-bold text-navy/60 uppercase tracking-widest font-heading">
            {isCurrentUser ? "You" : "Partner"}
          </p>
          <p className="text-lg font-black text-navy font-heading">
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs text-navy/60 font-medium pt-4 border-t border-navy/10">
        <span>Contribution</span>
        <span className="font-bold text-navy">{shareLabel}</span>
      </div>
    </div>
  );
};
