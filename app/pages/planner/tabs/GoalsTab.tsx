"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  GoalFilters,
  type OwnerFilter,
  type FlowFilter,
} from "../components/GoalFilters";
import { GoalCount } from "../components/GoalCount";
import { GoalsEmptyState } from "../components/GoalsEmptyState";
import { useDeleteGoalMutation } from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";
import { splitMembers, getMemberName } from "@/lib/utils/member";
import {
  calculateContributionRatios,
  getGoalOwnerLabel,
  getGoalContributions,
} from "@/lib/utils/contributions";
import { GoalListItem } from "../components/goalListItem";
import { GoalSlideOver } from "../goals/goalSlideOver";

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

  const { currentMember, partnerMember } = splitMembers(members, currentUserId);
  const hasPartner = members.length > 1;
  const currentName = getMemberName(currentMember, "You");
  const partnerName = getMemberName(partnerMember, "Partner");

  const ratios = useMemo(
    () =>
      calculateContributionRatios(
        currentMember,
        partnerMember,
        ratioMode,
        customRatios,
        currentUserId,
      ),
    [currentMember, partnerMember, ratioMode, customRatios, currentUserId],
  );

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      if (ownerFilter !== "all") {
        const isOwnGoal =
          goal.ownerType === "USER" && goal.owner?.id === currentUserId;
        const isPartnerGoal =
          goal.ownerType === "PARTNER" ||
          (goal.ownerType === "USER" && goal.owner?.id !== currentUserId);
        const isShared = goal.ownerType === "SHARED";

        if (ownerFilter === "mine" && !isOwnGoal) {
          return false;
        }
        if (ownerFilter === "partner" && !isPartnerGoal) {
          return false;
        }
        if (ownerFilter === "shared" && !isShared) {
          return false;
        }
      }

      if (flowFilter !== "all" && goal.flowType !== flowFilter) {
        return false;
      }
      return true;
    });
  }, [goals, ownerFilter, flowFilter, currentUserId]);

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Delete this goal?")) return;
    try {
      await deleteGoal({ variables: { id: goalId } });
      toast.success("Goal removed");
      onUpdate();
    } catch {
      toast.error("Failed to delete goal. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Goal + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <Button
          onClick={() => setIsCreating(true)}
          className="w-full sm:w-auto sm:order-last rounded-full bg-highlight hover:bg-highlight/90 font-bold shadow-lg shadow-highlight/20 shrink-0 px-6 py-3"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>

        <GoalFilters
          ownerFilter={ownerFilter}
          flowFilter={flowFilter}
          onOwnerFilterChange={setOwnerFilter}
          onFlowFilterChange={setFlowFilter}
        />
      </div>

      {/* Goals List */}
      <div className="flex flex-col gap-4">
        {filteredGoals.length === 0 ? (
          <GoalsEmptyState
            hasGoals={goals.length > 0}
            onAddGoal={() => setIsCreating(true)}
          />
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
              contributions={getGoalContributions(
                goal.monthlyAmount,
                goal.ownerType,
                goal.owner?.id,
                currentUserId,
                hasPartner,
                ratios,
              )}
              ratios={ratios}
              currentName={currentName}
              partnerName={partnerName}
              ownerLabel={getGoalOwnerLabel(
                goal.ownerType,
                goal.owner?.id,
                currentUserId,
                currentName,
                partnerName,
              )}
              onEdit={() => setSlideOverGoal(goal)}
              onDelete={() => handleDeleteGoal(goal.id)}
              isDeleting={deleting}
            />
          ))
        )}
      </div>

      <GoalCount total={goals.length} filtered={filteredGoals.length} />

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
