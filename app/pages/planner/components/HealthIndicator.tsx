"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type BudgetHealthStatus = "healthy" | "warning" | "danger";

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
  // Calculate health status based on remaining percentage
  const remainingPercentage =
    totalIncome > 0 ? (remainingAmount / totalIncome) * 100 : 0;

  let statusText: string;
  let statusColor: string;
  let Icon: typeof TrendingUp;

  if (remainingAmount < 0) {
    statusText = "Over Budget";
    statusColor = "text-red-600 bg-red-50";
    Icon = TrendingDown;
  } else if (remainingPercentage < 10) {
    statusText = "Tight";
    statusColor = "text-amber-600 bg-amber-50";
    Icon = Minus;
  } else {
    statusText = "Healthy";
    statusColor = "text-green-600 bg-green-50";
    Icon = TrendingUp;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
          statusColor
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {statusText}
      </div>
    </div>
  );
};

// Larger card variant for dashboard
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

  let status: BudgetHealthStatus;
  let bgGradient: string;

  if (remainingAmount < 0) {
    status = "danger";
    bgGradient = "from-red-50 to-red-100/50";
  } else if (remainingPercentage < 10) {
    status = "warning";
    bgGradient = "from-amber-50 to-amber-100/50";
  } else {
    status = "healthy";
    bgGradient = "from-green-50 to-green-100/50";
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div
      className={cn(
        "rounded-xl p-5 bg-gradient-to-br border",
        bgGradient,
        status === "danger" && "border-red-200",
        status === "warning" && "border-amber-200",
        status === "healthy" && "border-green-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-navy/60">Monthly Remaining</p>
          <p
            className={cn(
              "text-2xl font-heading font-bold mt-1",
              status === "danger" && "text-red-700",
              status === "warning" && "text-amber-700",
              status === "healthy" && "text-green-700"
            )}
          >
            {formatCurrency(remainingAmount)}
          </p>
        </div>
        <HealthIndicator
          remainingAmount={remainingAmount}
          totalIncome={totalIncome}
        />
      </div>
      <div className="mt-3 text-xs text-navy/50">
        {remainingPercentage.toFixed(0)}% of combined take-home
      </div>
    </div>
  );
};

export default HealthIndicator;
