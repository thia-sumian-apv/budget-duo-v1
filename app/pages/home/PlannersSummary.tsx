"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ChevronRight,
} from "lucide-react";
import { useMyPlannersQuery } from "../planner/Planner.api";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { RatioMode } from "@/app/apolloClient.types";
import { formatCurrency } from "@/lib/utils/budget";

interface FlowSummary {
  expense: number;
  savings: number;
  investment: number;
  total: number;
}

interface PlannerSummaryData {
  plannerId: string;
  plannerName: string;
  userFlow: FlowSummary;
  totalFlow: FlowSummary;
  takeHome: number;
  remaining: number;
}

const FlowBadge = ({
  type,
  amount,
  compact = false,
}: {
  type: "expense" | "savings" | "investment";
  amount: number;
  compact?: boolean;
}) => {
  const config = {
    expense: {
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-100",
      label: "Expenses",
    },
    savings: {
      icon: PiggyBank,
      color: "text-green-600",
      bg: "bg-green-100",
      label: "Savings",
    },
    investment: {
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-100",
      label: "Investments",
    },
  }[type];

  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">{formatCurrency(amount)}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between rounded-lg ${config.bg} px-3 py-2`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${config.color}`} />
        <span className="text-sm text-navy/70">{config.label}</span>
      </div>
      <span className={`text-sm font-medium ${config.color}`}>
        {formatCurrency(amount)}/mo
      </span>
    </div>
  );
};

const PlannersSummary = () => {
  const { userId } = useCurrentUser();
  const { data, loading, error } = useMyPlannersQuery();

  const summaries = useMemo((): PlannerSummaryData[] => {
    if (!data?.myPlanners || !userId) return [];

    return data.myPlanners.map((planner) => {
      const goals = planner.goals ?? [];
      const members = planner.members ?? [];

      // Find current user's member data
      const currentMember = members.find((m) => m.user?.id === userId);
      const takeHome = currentMember?.cpfBreakdown?.takeHomePay ?? 0;

      // Calculate ratio for shared goals
      const totalTakeHome = members.reduce(
        (sum, m) => sum + (m.cpfBreakdown?.takeHomePay ?? 0),
        0
      );

      let userRatio = 0.5; // default
      if (planner.ratioMode === RatioMode.Custom && planner.customRatios) {
        const customRatio = planner.customRatios.find(
          (r) => r.userId === userId
        );
        userRatio = customRatio ? customRatio.percentage / 100 : 0.5;
      } else if (
        totalTakeHome > 0 &&
        currentMember?.cpfBreakdown?.takeHomePay
      ) {
        userRatio = currentMember.cpfBreakdown.takeHomePay / totalTakeHome;
      }

      // Initialize flow summaries
      const userFlow: FlowSummary = {
        expense: 0,
        savings: 0,
        investment: 0,
        total: 0,
      };
      const totalFlow: FlowSummary = {
        expense: 0,
        savings: 0,
        investment: 0,
        total: 0,
      };

      for (const goal of goals) {
        const monthlyAmount = goal.monthlyAmount ?? 0;
        const flowKey = goal.flowType.toLowerCase() as keyof Omit<
          FlowSummary,
          "total"
        >;

        // Total (all goals)
        totalFlow[flowKey] += monthlyAmount;
        totalFlow.total += monthlyAmount;

        // User's share
        const isUserGoal =
          goal.ownerType === "USER" && goal.owner?.id === userId;
        const isShared = goal.ownerType === "SHARED";

        if (isUserGoal) {
          userFlow[flowKey] += monthlyAmount;
          userFlow.total += monthlyAmount;
        } else if (isShared) {
          const userShare = monthlyAmount * userRatio;
          userFlow[flowKey] += userShare;
          userFlow.total += userShare;
        }
      }

      return {
        plannerId: planner.id,
        plannerName: planner.name,
        userFlow,
        totalFlow,
        takeHome,
        remaining: takeHome - userFlow.total,
      };
    });
  }, [data, userId]);

  // Aggregate across all planners
  const aggregated = useMemo(() => {
    const result = {
      expense: 0,
      savings: 0,
      investment: 0,
      total: 0,
      takeHome: 0,
      remaining: 0,
    };

    for (const summary of summaries) {
      result.expense += summary.userFlow.expense;
      result.savings += summary.userFlow.savings;
      result.investment += summary.userFlow.investment;
      result.total += summary.userFlow.total;
      result.takeHome += summary.takeHome;
      result.remaining += summary.remaining;
    }

    return result;
  }, [summaries]);

  if (loading) {
    return (
      <div className="p-5">
        <div className="h-6 w-32 rounded bg-navy/10 animate-pulse mb-4" />
        <div className="space-y-2">
          <div className="h-10 rounded-lg bg-navy/5 animate-pulse" />
          <div className="h-10 rounded-lg bg-navy/5 animate-pulse" />
          <div className="h-10 rounded-lg bg-navy/5 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-sm text-red-600">
        Failed to load budget summary
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="p-5">
        <h3 className="font-heading text-sm font-semibold text-navy/80 mb-3">
          Budget Overview
        </h3>
        <p className="text-sm text-navy/50">
          Create or join a planner to see your budget summary.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h3 className="font-heading text-sm font-semibold text-navy/80 mb-4">
        Your Monthly Budget
      </h3>

      {/* Flow breakdown */}
      <div className="space-y-2 mb-4">
        <FlowBadge type="expense" amount={aggregated.expense} />
        <FlowBadge type="savings" amount={aggregated.savings} />
        <FlowBadge type="investment" amount={aggregated.investment} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-navy/10">
        <div>
          <div className="text-xs text-navy/50 mb-0.5">Total Allocated</div>
          <div className="text-lg font-semibold text-navy/90">
            {formatCurrency(aggregated.total)}
          </div>
        </div>
        <div>
          <div className="text-xs text-navy/50 mb-0.5">Remaining</div>
          <div
            className={`text-lg font-semibold ${aggregated.remaining >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {formatCurrency(aggregated.remaining)}
          </div>
        </div>
      </div>

      {/* Per-planner breakdown if multiple */}
      {summaries.length > 1 && (
        <div className="mt-4 pt-3 border-t border-navy/10">
          <div className="text-xs text-navy/50 mb-2">By Planner</div>
          <div className="space-y-2">
            {summaries.map((summary) => (
              <div
                key={summary.plannerId}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-navy/70 truncate">
                  {summary.plannerName}
                </span>
                <div className="flex items-center gap-3">
                  <FlowBadge
                    type="expense"
                    amount={summary.userFlow.expense}
                    compact
                  />
                  <FlowBadge
                    type="savings"
                    amount={summary.userFlow.savings}
                    compact
                  />
                  <FlowBadge
                    type="investment"
                    amount={summary.userFlow.investment}
                    compact
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hint */}
      <div className="mt-4 pt-3 border-t border-navy/10">
        <div className="flex items-center gap-1 text-xs text-navy/40">
          <span>Select Budget Planner for details</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};

export default PlannersSummary;
