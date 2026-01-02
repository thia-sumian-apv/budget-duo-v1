"use client";

import { cn } from "@/lib/utils";

// Flow type color mapping - consistent across the app
export const FLOW_TYPE_COLORS = {
  EXPENSE: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-200",
  },
  SAVINGS: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
    border: "border-green-200",
  },
  INVESTMENT: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200",
  },
} as const;

export type FlowType = keyof typeof FLOW_TYPE_COLORS;

// Persistent legend component
interface FlowTypeLegendProps {
  className?: string;
  compact?: boolean;
}

export const FlowTypeLegend = ({ className, compact }: FlowTypeLegendProps) => (
  <div
    className={cn(
      "flex items-center gap-4 text-xs text-navy/60",
      !compact && "py-2 px-3 bg-base/50 rounded-lg",
      className
    )}
  >
    <span className="flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", FLOW_TYPE_COLORS.EXPENSE.dot)} />
      Expense
    </span>
    <span className="flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", FLOW_TYPE_COLORS.SAVINGS.dot)} />
      Savings
    </span>
    <span className="flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", FLOW_TYPE_COLORS.INVESTMENT.dot)} />
      Investment
    </span>
  </div>
);

// Badge for individual flow type
interface FlowTypeBadgeProps {
  type: FlowType;
  className?: string;
}

export const FlowTypeBadge = ({ type, className }: FlowTypeBadgeProps) => {
  const colors = FLOW_TYPE_COLORS[type];
  const label = type.charAt(0) + type.slice(1).toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
      {label}
    </span>
  );
};

export default FlowTypeLegend;
