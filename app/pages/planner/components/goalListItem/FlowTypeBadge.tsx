"use client";

import { cn } from "@/lib/utils";
import { FLOW_TYPE_CONFIG, type FlowType } from "@/lib/utils/flowTypes";

interface FlowTypeBadgeProps {
  flowType: string;
}

export const FlowTypeBadge = ({ flowType }: FlowTypeBadgeProps) => {
  const config = FLOW_TYPE_CONFIG[flowType as FlowType];

  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0",
        config?.badgeStyle ?? "bg-gray-200 text-navy/60",
      )}
    >
      {config?.label ?? flowType}
    </span>
  );
};
