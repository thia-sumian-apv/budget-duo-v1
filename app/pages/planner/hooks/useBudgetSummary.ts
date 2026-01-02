import { useMemo } from "react";
import type { GetPlannerQuery } from "../Planner.api";
import type { FlowType } from "../components/FlowTypeLegend";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
type Goal = Planner["goals"][0];

interface UseBudgetSummaryProps {
  planner: Planner;
  currentUserId: string | null;
}

export const useBudgetSummary = ({
  planner,
  currentUserId,
}: UseBudgetSummaryProps) => {
  const { members, goals, ratioMode, customRatios } = planner;

  return useMemo(() => {
    const currentMember = members.find((m) => m.user.id === currentUserId);
    const partnerMember = members.find((m) => m.user.id !== currentUserId);

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

    const flowTypeTotals = {
      EXPENSE: 0,
      SAVINGS: 0,
      INVESTMENT: 0,
    };

    const goalsByFlowType: Record<FlowType, Goal[]> = {
      EXPENSE: [],
      SAVINGS: [],
      INVESTMENT: [],
    };

    let currentAllocations = 0;
    let partnerAllocations = 0;

    goals.forEach((goal) => {
      const flowType = goal.flowType as FlowType;
      flowTypeTotals[flowType] += goal.monthlyAmount;
      goalsByFlowType[flowType].push(goal);

      if (goal.ownerType === "USER" && goal.owner?.id === currentUserId) {
        currentAllocations += goal.monthlyAmount;
      } else if (
        goal.ownerType === "PARTNER" ||
        (goal.ownerType === "USER" && goal.owner?.id !== currentUserId)
      ) {
        partnerAllocations += goal.monthlyAmount;
      } else if (goal.ownerType === "SHARED") {
        currentAllocations += goal.monthlyAmount * currentRatio;
        partnerAllocations += goal.monthlyAmount * partnerRatio;
      }
    });

    const currentRemaining = currentTakeHome - currentAllocations;
    const partnerRemaining = partnerTakeHome - partnerAllocations;
    const combinedRemaining = currentRemaining + partnerRemaining;

    return {
      currentMember,
      partnerMember,
      currentTakeHome,
      partnerTakeHome,
      combinedTakeHome,
      currentRemaining,
      partnerRemaining,
      combinedRemaining,
      currentRatio,
      partnerRatio,
      flowTypeTotals,
      goalsByFlowType,
      goalCount: goals.length,
    };
  }, [members, goals, ratioMode, customRatios, currentUserId]);
};
