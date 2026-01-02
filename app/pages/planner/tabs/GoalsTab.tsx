"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowTypeLegend } from "../components/FlowTypeLegend";
import {
  GoalFilters,
  type OwnerFilter,
  type FlowFilter,
} from "../components/GoalFilters";
import { GoalListItem } from "../components/GoalListItem";
import { GoalSlideOver } from "../goals/GoalSlideOver";
import { useDeleteGoalMutation } from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
type Goal = Planner["goals"][0];

interface GoalsTabProps {
  plannerId: string;
  planner: Planner;
  currentUserId: string | null;
  onUpdate: () => void;
}

export const GoalsTab = ({
  plannerId,
  planner,
  currentUserId,
  onUpdate,
}: GoalsTabProps) => {
  const { goals, members, ratioMode, customRatios } = planner;
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");
  const [flowFilter, setFlowFilter] = useState<FlowFilter>("all");
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [slideOverGoal, setSlideOverGoal] = useState<Goal | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [deleteGoal, { loading: deleting }] = useDeleteGoalMutation();

  const currentMember = members.find((m) => m.user.id === currentUserId);
  const partnerMember = members.find((m) => m.user.id !== currentUserId);
  const hasPartner = members.length > 1;

  const currentName =
    currentMember?.displayName || currentMember?.user.name || "You";
  const partnerName =
    partnerMember?.displayName || partnerMember?.user.name || "Partner";

  // Calculate contribution ratios
  const ratios = useMemo(() => {
    const currentTakeHome = currentMember?.cpfBreakdown?.takeHomePay ?? 0;
    const partnerTakeHome = partnerMember?.cpfBreakdown?.takeHomePay ?? 0;
    const combinedTakeHome = currentTakeHome + partnerTakeHome;

    let currentRatio = 0.5;
    let partnerRatio = 0.5;

    if (ratioMode === "INCOME_BASED" && combinedTakeHome > 0) {
      currentRatio = currentTakeHome / combinedTakeHome;
      partnerRatio = partnerTakeHome / combinedTakeHome;
    } else if (ratioMode === "CUSTOM" && customRatios) {
      const currentCustom = customRatios.find(
        (r) => r.userId === currentUserId
      );
      const partnerCustom = customRatios.find(
        (r) => r.userId !== currentUserId
      );
      currentRatio = (currentCustom?.percentage ?? 50) / 100;
      partnerRatio = (partnerCustom?.percentage ?? 50) / 100;
    }

    return { currentRatio, partnerRatio };
  }, [currentMember, partnerMember, ratioMode, customRatios, currentUserId]);

  // Filter goals
  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      if (ownerFilter !== "all") {
        const isOwnGoal =
          goal.ownerType === "USER" && goal.owner?.id === currentUserId;
        const isPartnerGoal =
          goal.ownerType === "USER" && goal.owner?.id !== currentUserId;
        const isShared = goal.ownerType === "SHARED";

        if (ownerFilter === "mine" && !isOwnGoal) return false;
        if (ownerFilter === "partner" && !isPartnerGoal) return false;
        if (ownerFilter === "shared" && !isShared) return false;
      }

      if (flowFilter !== "all" && goal.flowType !== flowFilter) return false;
      return true;
    });
  }, [goals, ownerFilter, flowFilter, currentUserId]);

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Delete this goal?")) return;
    try {
      await deleteGoal({ variables: { id: goalId } });
      onUpdate();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const getOwnerLabel = (goal: Goal) => {
    if (goal.ownerType === "SHARED") return "Shared";
    if (goal.owner?.id === currentUserId) return "Yours";
    return partnerName;
  };

  const getContributions = (goal: Goal) => {
    const monthlyAmount = goal.monthlyAmount;
    if (goal.ownerType === "SHARED" && hasPartner) {
      return {
        current: monthlyAmount * ratios.currentRatio,
        partner: monthlyAmount * ratios.partnerRatio,
        isShared: true,
      };
    }
    if (goal.ownerType === "USER" && goal.owner?.id === currentUserId) {
      return { current: monthlyAmount, partner: 0, isShared: false };
    }
    return { current: 0, partner: monthlyAmount, isShared: false };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-navy">
          Goals & Expenses
        </h3>
        <Button
          onClick={() => setIsCreating(true)}
          className="rounded-full bg-highlight hover:bg-highlight/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {/* Filters */}
      <GoalFilters
        ownerFilter={ownerFilter}
        flowFilter={flowFilter}
        onOwnerFilterChange={setOwnerFilter}
        onFlowFilterChange={setFlowFilter}
      />

      {/* Legend */}
      <FlowTypeLegend />

      {/* Goals List */}
      <div className="space-y-2">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-8 text-navy/50">
            {goals.length === 0
              ? "No goals yet. Add your first goal to get started."
              : "No goals match your filters."}
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <GoalListItem
              key={goal.id}
              goal={goal}
              isExpanded={expandedGoal === goal.id}
              onToggleExpand={() =>
                setExpandedGoal(expandedGoal === goal.id ? null : goal.id)
              }
              canEdit={
                goal.owner?.id === currentUserId || goal.ownerType === "SHARED"
              }
              hasPartner={hasPartner}
              contributions={getContributions(goal)}
              ratios={ratios}
              currentName={currentName}
              partnerName={partnerName}
              ownerLabel={getOwnerLabel(goal)}
              onEdit={() => setSlideOverGoal(goal)}
              onDelete={() => handleDeleteGoal(goal.id)}
              isDeleting={deleting}
            />
          ))
        )}
      </div>

      {/* Goal count */}
      <p className="text-xs text-navy/50 pt-2">
        Showing {filteredGoals.length} of {goals.length} goal
        {goals.length !== 1 ? "s" : ""}
      </p>

      {/* Slide-over for editing/creating */}
      <GoalSlideOver
        isOpen={isCreating || !!slideOverGoal}
        onClose={() => {
          setIsCreating(false);
          setSlideOverGoal(null);
        }}
        plannerId={plannerId}
        goal={slideOverGoal}
        members={members}
        onSuccess={() => {
          setIsCreating(false);
          setSlideOverGoal(null);
          onUpdate();
        }}
      />
    </div>
  );
};

export default GoalsTab;
