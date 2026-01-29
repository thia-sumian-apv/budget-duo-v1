"use client";

import { useMemo } from "react";
import { useMyPlannersQuery } from "@/app/pages/planner/Planner.api";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { RatioMode } from "@/app/apolloClient.types";
import {
  AllocationSummaryBanner,
  CreatePlannerCard,
  JoinPlannerCard,
  PlannerSummaryCard,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { userId } = useCurrentUser();
  const { data, loading, error } = useMyPlannersQuery();

  // Calculate aggregated summary data
  const summaryData = useMemo(() => {
    if (!data?.myPlanners || !userId) {
      return {
        totalIncome: 0,
        totalAllocated: 0,
        totalRemaining: 0,
        breakdown: { expenses: 0, savings: 0, investments: 0 },
      };
    }

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalSavings = 0;
    let totalInvestments = 0;

    for (const planner of data.myPlanners) {
      const members = planner.members ?? [];
      const goals = planner.goals ?? [];

      // Find current user's member data
      const currentMember = members.find((m) => m.user?.id === userId);
      const takeHome = currentMember?.cpfBreakdown?.takeHomePay ?? 0;
      totalIncome += takeHome;

      // Calculate ratio for shared goals
      const totalTakeHome = members.reduce(
        (sum, m) => sum + (m.cpfBreakdown?.takeHomePay ?? 0),
        0
      );

      let userRatio = 0.5;
      if (planner.ratioMode === RatioMode.Custom && planner.customRatios) {
        const customRatio = planner.customRatios.find((r) => r.userId === userId);
        userRatio = customRatio ? customRatio.percentage / 100 : 0.5;
      } else if (totalTakeHome > 0 && currentMember?.cpfBreakdown?.takeHomePay) {
        userRatio = currentMember.cpfBreakdown.takeHomePay / totalTakeHome;
      }

      // Calculate user's share of goals
      for (const goal of goals) {
        const monthlyAmount = goal.monthlyAmount ?? 0;
        const flowType = goal.flowType?.toLowerCase();
        const isUserGoal = goal.ownerType === "USER" && goal.owner?.id === userId;
        const isShared = goal.ownerType === "SHARED";

        let userShare = 0;
        if (isUserGoal) {
          userShare = monthlyAmount;
        } else if (isShared) {
          userShare = monthlyAmount * userRatio;
        }

        if (flowType === "expense") {
          totalExpenses += userShare;
        } else if (flowType === "savings") {
          totalSavings += userShare;
        } else if (flowType === "investment") {
          totalInvestments += userShare;
        }
      }
    }

    const totalAllocated = totalExpenses + totalSavings + totalInvestments;

    return {
      totalIncome,
      totalAllocated,
      totalRemaining: totalIncome - totalAllocated,
      breakdown: {
        expenses: totalExpenses,
        savings: totalSavings,
        investments: totalInvestments,
      },
    };
  }, [data, userId]);

  // Transform planners for card display
  const plannerCards = useMemo(() => {
    if (!data?.myPlanners || !userId) return [];

    return data.myPlanners.map((planner) => {
      const members = planner.members ?? [];
      const goals = planner.goals ?? [];

      // Calculate user's allocated amount for this planner
      let userAllocated = 0;

      const currentMember = members.find((m) => m.user?.id === userId);
      const takeHome = currentMember?.cpfBreakdown?.takeHomePay ?? 0;

      const totalTakeHome = members.reduce(
        (sum, m) => sum + (m.cpfBreakdown?.takeHomePay ?? 0),
        0
      );

      let userRatio = 0.5;
      if (planner.ratioMode === RatioMode.Custom && planner.customRatios) {
        const customRatio = planner.customRatios.find((r) => r.userId === userId);
        userRatio = customRatio ? customRatio.percentage / 100 : 0.5;
      } else if (totalTakeHome > 0 && currentMember?.cpfBreakdown?.takeHomePay) {
        userRatio = currentMember.cpfBreakdown.takeHomePay / totalTakeHome;
      }

      for (const goal of goals) {
        const monthlyAmount = goal.monthlyAmount ?? 0;
        const isUserGoal = goal.ownerType === "USER" && goal.owner?.id === userId;
        const isShared = goal.ownerType === "SHARED";

        if (isUserGoal) {
          userAllocated += monthlyAmount;
        } else if (isShared) {
          userAllocated += monthlyAmount * userRatio;
        }
      }

      return {
        id: planner.id,
        name: planner.name,
        members: members.map((m) => ({
          id: m.user?.id ?? "",
          name: m.displayName ?? m.user?.name ?? "",
        })),
        totalAllocated: Math.round(userAllocated),
        totalRemaining: Math.round(takeHome - userAllocated),
      };
    });
  }, [data, userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton for banner */}
        <div className="dashboard-card p-8 bg-navy/10 animate-pulse h-48" />
        {/* Skeleton for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="dashboard-card p-6 animate-pulse h-52 bg-gray-100" />
          <div className="dashboard-card p-6 animate-pulse h-52 bg-gray-100" />
          <div className="dashboard-card p-6 animate-pulse h-52 bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card p-8 text-center">
        <p className="text-red-600">Failed to load dashboard data</p>
        <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  const hasPlanners = plannerCards.length > 0;

  return (
    <div className="space-y-6">
      {/* Allocation Summary Banner - only show if user has planners */}
      {hasPlanners && (
        <AllocationSummaryBanner
          totalIncome={summaryData.totalIncome}
          totalAllocated={summaryData.totalAllocated}
          totalRemaining={summaryData.totalRemaining}
          breakdown={summaryData.breakdown}
        />
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">Your Planners</h2>
        {hasPlanners && (
          <span className="text-sm text-gray-500">
            {plannerCards.length} planner{plannerCards.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create and Join cards always visible */}
        <CreatePlannerCard />
        <JoinPlannerCard />

        {/* Existing planner cards */}
        {plannerCards.map((planner) => (
          <PlannerSummaryCard
            key={planner.id}
            id={planner.id}
            name={planner.name}
            members={planner.members}
            totalAllocated={planner.totalAllocated}
            totalRemaining={planner.totalRemaining}
          />
        ))}
      </div>

      {/* Empty state hint */}
      {!hasPlanners && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Create a new planner to start budgeting with your partner, or join an existing one with an invite code.
          </p>
        </div>
      )}
    </div>
  );
}
