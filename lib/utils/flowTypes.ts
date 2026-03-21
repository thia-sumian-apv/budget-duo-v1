/**
 * Single source of truth for flow type configuration.
 * Used by FlowTypeBreakdown, FlowTypeBadge, GoalTypeSelector, etc.
 */

export const FLOW_TYPE_CONFIG = {
  EXPENSE: {
    label: "Expense",
    pluralLabel: "Expenses",
    barColor: "bg-red-500",
    badgeStyle: "bg-red-100 text-red-600",
    activeStyle: "border-2 border-red-400 bg-red-50 text-red-600",
  },
  SAVINGS: {
    label: "Savings",
    pluralLabel: "Savings",
    barColor: "bg-emerald-500",
    badgeStyle: "bg-emerald-100 text-emerald-600",
    activeStyle: "border-2 border-emerald-400 bg-emerald-50 text-emerald-600",
  },
  INVESTMENT: {
    label: "Investment",
    pluralLabel: "Investments",
    barColor: "bg-highlight",
    badgeStyle: "bg-highlight/20 text-highlight",
    activeStyle: "border-2 border-highlight bg-highlight/5 text-highlight",
  },
} as const;

export type FlowType = keyof typeof FLOW_TYPE_CONFIG;

export const FLOW_TYPES: FlowType[] = ["EXPENSE", "SAVINGS", "INVESTMENT"];
