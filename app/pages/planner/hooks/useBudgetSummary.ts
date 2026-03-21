import { useMemo } from "react";
import type { GetPlannerQuery } from "../Planner.api";
import type { FlowType } from "@/lib/utils/flowTypes";

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

    // CPF OA available for eligible goals
    const currentOaBudget = currentMember?.cpfBreakdown?.ordinaryAccount ?? 0;
    const partnerOaBudget = partnerMember?.cpfBreakdown?.ordinaryAccount ?? 0;

    let currentRatio = 0.5;
    let partnerRatio = 0.5;

    if (ratioMode === "INCOME_BASED" && combinedTakeHome > 0) {
      currentRatio = currentTakeHome / combinedTakeHome;
      partnerRatio = partnerTakeHome / combinedTakeHome;
    } else if (ratioMode === "CUSTOM" && customRatios) {
      const currentCustom = customRatios.find(
        (r) => r.userId === currentUserId,
      );
      const partnerCustom = customRatios.find(
        (r) => r.userId !== currentUserId,
      );
      currentRatio = (currentCustom?.percentage ?? 50) / 100;
      partnerRatio = (partnerCustom?.percentage ?? 50) / 100;
    }

    const flowTypeTotals: Record<FlowType, number> = {
      EXPENSE: 0,
      SAVINGS: 0,
      INVESTMENT: 0,
    };

    const currentFlowTypeTotals: Record<FlowType, number> = {
      EXPENSE: 0,
      SAVINGS: 0,
      INVESTMENT: 0,
    };

    const partnerFlowTypeTotals: Record<FlowType, number> = {
      EXPENSE: 0,
      SAVINGS: 0,
      INVESTMENT: 0,
    };

    const goalsByFlowType: Record<FlowType, Goal[]> = {
      EXPENSE: [],
      SAVINGS: [],
      INVESTMENT: [],
    };

    // Track cash-only allocations (after CPF OA deductions)
    let currentCashAllocations = 0;
    let partnerCashAllocations = 0;

    // Remaining OA budget decreases as CPF-eligible goals are processed
    let currentOaRemaining = currentOaBudget;
    let partnerOaRemaining = partnerOaBudget;

    // Track total OA used for reporting
    let currentOaUsed = 0;
    let partnerOaUsed = 0;

    /**
     * For a given member share of a goal, determine how much comes from
     * CPF OA vs cash. Returns the amount that must come from cash.
     */
    const allocateForMember = (
      amount: number,
      isCpfEligible: boolean,
      member: "current" | "partner",
    ): number => {
      if (!isCpfEligible || amount <= 0) return amount;

      const oaRemaining =
        member === "current" ? currentOaRemaining : partnerOaRemaining;
      const fromOa = Math.min(amount, oaRemaining);
      const fromCash = amount - fromOa;

      if (member === "current") {
        currentOaRemaining -= fromOa;
        currentOaUsed += fromOa;
      } else {
        partnerOaRemaining -= fromOa;
        partnerOaUsed += fromOa;
      }

      return fromCash;
    };

    goals.forEach((goal) => {
      const flowType = goal.flowType as FlowType;
      flowTypeTotals[flowType] += goal.monthlyAmount;
      goalsByFlowType[flowType].push(goal);

      if (goal.ownerType === "USER" && goal.owner?.id === currentUserId) {
        const cashAmount = allocateForMember(
          goal.monthlyAmount,
          goal.isCpfEligible,
          "current",
        );
        currentCashAllocations += cashAmount;
        currentFlowTypeTotals[flowType] += goal.monthlyAmount;
      } else if (
        goal.ownerType === "PARTNER" ||
        (goal.ownerType === "USER" && goal.owner?.id !== currentUserId)
      ) {
        const cashAmount = allocateForMember(
          goal.monthlyAmount,
          goal.isCpfEligible,
          "partner",
        );
        partnerCashAllocations += cashAmount;
        partnerFlowTypeTotals[flowType] += goal.monthlyAmount;
      } else if (goal.ownerType === "SHARED") {
        const currentShare = goal.monthlyAmount * currentRatio;
        const partnerShare = goal.monthlyAmount * partnerRatio;

        const currentCash = allocateForMember(
          currentShare,
          goal.isCpfEligible,
          "current",
        );
        const partnerCash = allocateForMember(
          partnerShare,
          goal.isCpfEligible,
          "partner",
        );

        currentCashAllocations += currentCash;
        partnerCashAllocations += partnerCash;
        currentFlowTypeTotals[flowType] += currentShare;
        partnerFlowTypeTotals[flowType] += partnerShare;
      }
    });

    const currentRemaining = currentTakeHome - currentCashAllocations;
    const partnerRemaining = partnerTakeHome - partnerCashAllocations;
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
      currentFlowTypeTotals,
      partnerFlowTypeTotals,
      goalsByFlowType,
      goalCount: goals.length,
      // CPF OA tracking
      currentOaBudget,
      partnerOaBudget,
      currentOaUsed,
      partnerOaUsed,
      currentOaRemaining,
      partnerOaRemaining,
    };
  }, [members, goals, ratioMode, customRatios, currentUserId]);
};
