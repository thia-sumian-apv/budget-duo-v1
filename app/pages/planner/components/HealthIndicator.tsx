"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/budget";
import { TrendingUp, TrendingDown, Minus, Wallet, type LucideIcon } from "lucide-react";

// --- Status types & config ---

export type BudgetHealthStatus = "healthy" | "warning" | "danger";

interface StatusConfig {
  label: string;
  Icon: LucideIcon;
  badge: string;
  card: string;
  amount: string;
  footer: string;
}

const STATUS_CONFIG: Record<BudgetHealthStatus, StatusConfig> = {
  healthy: {
    label: "Healthy",
    Icon: TrendingUp,
    badge: "bg-[#1a3a5a] text-cyan-300",
    card: "bg-navy p-8 md:p-10 shadow-sm group text-white",
    amount: "text-highlight text-5xl md:text-7xl",
    footer: "text-white/60 border-white/10",
  },
  warning: {
    label: "Tight",
    Icon: Minus,
    badge: "text-amber-600 bg-amber-50",
    card: "bg-white p-8 md:p-10 shadow-sm border border-amber-200",
    amount: "text-amber-700 text-4xl",
    footer: "text-navy/50 border-navy/10",
  },
  danger: {
    label: "Over Budget",
    Icon: TrendingDown,
    badge: "text-red-600 bg-red-50",
    card: "bg-white p-8 md:p-10 shadow-sm border border-red-200",
    amount: "text-red-700 text-4xl",
    footer: "text-navy/50 border-navy/10",
  },
};

// --- Utility ---

export function getBudgetHealthStatus(
  remainingAmount: number,
  totalIncome: number,
): BudgetHealthStatus {
  if (remainingAmount < 0) return "danger";
  const pct = totalIncome > 0 ? (remainingAmount / totalIncome) * 100 : 0;
  if (pct < 10) return "warning";
  return "healthy";
}

// --- Small badge ---

interface HealthIndicatorProps {
  remainingAmount: number;
  totalIncome: number;
  className?: string;
}

export const HealthIndicator = ({
  remainingAmount,
  totalIncome,
  className,
}: HealthIndicatorProps) => {
  const status = getBudgetHealthStatus(remainingAmount, totalIncome);
  const { label, Icon, badge } = STATUS_CONFIG[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
          badge,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
    </div>
  );
};

// --- Hero card ---

interface HealthSummaryCardProps {
  remainingAmount: number;
  totalIncome: number;
  className?: string;
}

export const HealthSummaryCard = ({
  remainingAmount,
  totalIncome,
  className,
}: HealthSummaryCardProps) => {
  const remainingPercentage =
    totalIncome > 0 ? (remainingAmount / totalIncome) * 100 : 0;

  const status = getBudgetHealthStatus(remainingAmount, totalIncome);
  const config = STATUS_CONFIG[status];
  const isHealthy = status === "healthy";

  return (
    <div
      className={cn("rounded-xl relative overflow-hidden", config.card, className)}
    >
      {/* Decorative watermark — always visible, faded on non-healthy */}
      <div
        className={cn(
          "absolute top-0 right-0 p-6 transition-transform group-hover:scale-110",
          isHealthy ? "opacity-10" : "opacity-5",
        )}
      >
        <Wallet className="h-28 w-28" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <h3
            className={cn(
              "font-heading font-bold uppercase tracking-wider text-sm",
              isHealthy ? "text-white/70" : "text-navy/60",
            )}
          >
            MONTHLY REMAINING
          </h3>
          <HealthIndicator
            remainingAmount={remainingAmount}
            totalIncome={totalIncome}
          />
        </div>

        <div className="flex items-baseline gap-2 mb-6">
          <span
            className={cn("font-black font-heading tracking-tight", config.amount)}
          >
            {formatCurrency(remainingAmount)}
          </span>
        </div>

        <p
          className={cn(
            "font-medium text-sm border-t pt-4 inline-block",
            config.footer,
          )}
        >
          {remainingPercentage.toFixed(0)}% of combined take-home
        </p>
      </div>
    </div>
  );
};

export default HealthIndicator;
