"use client";

import { formatCurrency } from "@/lib/utils/budget";

interface MemberIncomeSummaryProps {
  takeHomePay: number | null;
}

export const MemberIncomeSummary = ({
  takeHomePay,
}: MemberIncomeSummaryProps) => {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <span className="text-[10px] font-bold text-navy/60 tracking-widest uppercase">
        TAKE-HOME
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-navy">
          {takeHomePay != null ? formatCurrency(takeHomePay) : "Not set"}
        </span>
        {takeHomePay != null && (
          <span className="text-sm font-medium text-navy/60">/ mo</span>
        )}
      </div>
    </div>
  );
};
