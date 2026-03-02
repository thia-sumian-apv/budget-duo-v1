"use client";

import { useMemo, useState } from "react";
import { useMyPlannersQuery } from "@/app/pages/planner/Planner.api";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { RatioMode } from "@/app/apolloClient.types";
import {
  CreatePlannerCard,
  JoinPlannerCard,
  PlannerCard,
  PlannerSetupCard,
} from "@/components/planner";
import CreatePlannerModal from "@/app/pages/planner/CreatePlannerModal";
import JoinPlannerModal from "@/app/pages/planner/JoinPlannerModal";
import { useRouter } from "next/navigation";

export default function PlannerPage() {
  const router = useRouter();
  const { userId } = useCurrentUser();
  const { data, loading, error, refetch } = useMyPlannersQuery();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Transform planners for card display
  const plannerCards = useMemo(() => {
    if (!data?.myPlanners || !userId) return [];

    return data.myPlanners.map((planner) => {
      const members = planner.members ?? [];
      const goals = planner.goals ?? [];

      // Find current user's member data
      const currentMember = members.find((m) => m.user?.id === userId);
      const needsSetup = !currentMember?.age || !currentMember?.monthlyIncome;

      // Calculate user's allocated amount and remaining for this planner
      let userAllocated = 0;
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
        needsSetup,
        members: members.map((m) => ({
          id: m.user?.id ?? "",
          name: m.displayName ?? m.user?.name ?? "",
        })),
        totalAllocated: Math.round(userAllocated),
        totalRemaining: Math.round(takeHome - userAllocated),
        totalIncome: takeHome,
        lastActivity: planner.createdAt,
      };
    });
  }, [data, userId]);

  const handleCreateSuccess = (plannerId: string) => {
    setShowCreateModal(false);
    refetch().then(() => router.push(`/planner/${plannerId}`));
  };

  const handleJoinSuccess = (plannerId: string) => {
    setShowJoinModal(false);
    refetch().then(() => router.push(`/planner/${plannerId}`));
  };

  if (loading) {
    return (
      <div className="p-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-9 w-48 rounded bg-navy/10 animate-pulse mb-2" />
          <div className="h-5 w-80 rounded bg-navy/10 animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200/50 rounded-3xl p-8 min-h-[300px] animate-pulse" />
          <div className="bg-white border border-gray-200/50 rounded-3xl p-8 min-h-[300px] animate-pulse" />
          <div className="bg-white border border-gray-200/50 rounded-3xl p-8 min-h-[300px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 max-w-7xl mx-auto">
        <div className="bg-white border border-red-200 rounded-3xl p-8 text-center">
          <p className="text-red-600 font-semibold">Failed to load planners</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-navy">Budget Planner</h2>
          <p className="text-gray-500">
            Manage your household budgets and track your savings goals.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Create and Join cards always first */}
        <CreatePlannerCard onClick={() => setShowCreateModal(true)} />
        <JoinPlannerCard onClick={() => setShowJoinModal(true)} />

        {/* Existing planner cards */}
        {plannerCards.map((planner) =>
          planner.needsSetup ? (
            <PlannerSetupCard
              key={planner.id}
              id={planner.id}
              name={planner.name}
            />
          ) : (
            <PlannerCard
              key={planner.id}
              id={planner.id}
              name={planner.name}
              members={planner.members}
              totalAllocated={planner.totalAllocated}
              totalRemaining={planner.totalRemaining}
              totalIncome={planner.totalIncome}
              lastActivity={planner.lastActivity}
            />
          )
        )}
      </div>

      {/* Empty state hint */}
      {plannerCards.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Create a new planner to start budgeting with your partner, or join an existing one with an invite code.
          </p>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreatePlannerModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showJoinModal && (
        <JoinPlannerModal
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
}
