"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { IconTooltip } from "../InfoTooltip";
import { formatCurrency } from "@/lib/utils/budget";

interface CpfAccount {
  ordinaryAccount: number;
  specialAccount: number;
  medisaveAccount: number;
}

interface CpfBreakdownProps {
  cpf: CpfAccount;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const CpfBreakdown = ({
  cpf,
  isExpanded,
  onToggleExpand,
}: CpfBreakdownProps) => {
  const accounts = [
    { key: "oa" as const, label: "OA", value: cpf.ordinaryAccount },
    { key: "sa" as const, label: "SA", value: cpf.specialAccount },
    { key: "ma" as const, label: "MA", value: cpf.medisaveAccount },
  ];

  return (
    <div className="px-6 pb-6">
      <div className="border-t border-dashed border-navy/10 pt-4">
        <button
          onClick={onToggleExpand}
          className="flex items-center justify-between w-full text-sm font-semibold text-highlight hover:text-highlight/80"
        >
          <span>View CPF breakdown</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {accounts.map(({ key, label, value }) => (
            <div key={key} className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[10px] font-bold text-navy/60">
                  {label}
                </span>
                <IconTooltip term={key} className="ml-0.5" />
              </div>
              <p className="font-bold text-navy">{formatCurrency(value)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
