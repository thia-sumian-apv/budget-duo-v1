"use client";

import { Wallet, PiggyBank, LineChart } from "lucide-react";

interface AllocationBreakdown {
  expenses: number;
  savings: number;
  investments: number;
}

interface AllocationSummaryBannerProps {
  totalIncome: number;
  totalAllocated: number;
  totalRemaining: number;
  breakdown?: AllocationBreakdown;
}

export const AllocationSummaryBanner = ({
  totalIncome,
  totalAllocated,
  totalRemaining,
  breakdown = { expenses: 0, savings: 0, investments: 0 },
}: AllocationSummaryBannerProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const allocationPercentage = totalIncome > 0
    ? Math.round((totalAllocated / totalIncome) * 100)
    : 0;

  return (
    <div className="dashboard-card p-6 lg:p-8 bg-gradient-to-br from-navy to-navy-dark text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Main stats */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-white/60 uppercase tracking-wider mb-1">
              Total Monthly Income
            </p>
            <p className="text-3xl lg:text-4xl font-bold">{formatCurrency(totalIncome)}</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">{allocationPercentage}% allocated</span>
              <span className="text-white/60">{formatCurrency(totalRemaining)} remaining</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-highlight rounded-full transition-all duration-500"
                style={{ width: `${Math.min(allocationPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end gap-2 mb-1">
              <Wallet className="h-4 w-4 text-red-300" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Expenses</span>
            </div>
            <p className="text-lg lg:text-xl font-bold">{formatCurrency(breakdown.expenses)}</p>
          </div>

          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end gap-2 mb-1">
              <PiggyBank className="h-4 w-4 text-green-300" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Savings</span>
            </div>
            <p className="text-lg lg:text-xl font-bold">{formatCurrency(breakdown.savings)}</p>
          </div>

          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end gap-2 mb-1">
              <LineChart className="h-4 w-4 text-blue-300" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Investments</span>
            </div>
            <p className="text-lg lg:text-xl font-bold">{formatCurrency(breakdown.investments)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
