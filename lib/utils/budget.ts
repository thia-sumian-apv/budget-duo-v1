/**
 * Budget Calculation Utility
 *
 * Calculates budget summaries for planner members, including:
 * - Take-home pay after CPF deductions
 * - Goal/expense allocations with ratio splits
 * - CPF OA usage for eligible expenses
 * - Remaining budget
 */

import { calculateCPFContributions } from "./cpf";
import {
  GoalCategory,
  GoalOwnerType,
  RatioMode,
  type GoalDocument,
  type PlannerMember,
} from "@/types";

export interface GoalAllocation {
  goalId: string;
  goalName: string;
  monthlyAmount: number;
  fromTakeHome: number;
  fromCpfOa: number;
  ownerType: GoalOwnerType;
}

export interface MemberBudgetSummary {
  userId: string;
  displayName: string | null;
  monthlyIncome: number;
  takeHome: number;
  cpfOaMonthly: number;
  ratioPercentage: number;
  totalAllocations: number;
  cpfOaUsed: number;
  cashUsed: number;
  remaining: number;
  cpfOaRemaining: number;
  goalBreakdown: GoalAllocation[];
}

export interface BudgetSummary {
  members: MemberBudgetSummary[];
  combinedTakeHome: number;
  combinedAllocations: number;
  combinedRemaining: number;
  combinedCpfOaUsed: number;
}

interface MemberWithCPF extends PlannerMember {
  cpf: ReturnType<typeof calculateCPFContributions>;
}

/**
 * Calculate the contribution ratio for each member
 */
function calculateRatios(
  members: MemberWithCPF[],
  ratioMode: RatioMode,
  customRatios?: Record<string, number> | null
): Record<string, number> {
  const ratios: Record<string, number> = {};

  if (ratioMode === RatioMode.CUSTOM && customRatios) {
    // Use custom ratios (percentages)
    for (const member of members) {
      const userId = member.userId.toString();
      ratios[userId] = (customRatios[userId] ?? 0) / 100;
    }
  } else {
    // Income-based ratios
    const totalIncome = members.reduce(
      (sum, m) => sum + (m.cpf?.takeHomePay ?? 0),
      0
    );

    if (totalIncome === 0) {
      // Equal split if no income data
      const equalRatio = 1 / members.length;
      for (const member of members) {
        ratios[member.userId.toString()] = equalRatio;
      }
    } else {
      for (const member of members) {
        const userId = member.userId.toString();
        ratios[userId] = (member.cpf?.takeHomePay ?? 0) / totalIncome;
      }
    }
  }

  return ratios;
}

/**
 * Calculate the monthly amount for a goal
 */
function getMonthlyAmount(goal: GoalDocument): number {
  if (goal.category === GoalCategory.MONTHLY) {
    return goal.amount;
  }
  // Time-bound goal: divide by duration
  return goal.duration ? goal.amount / goal.duration : goal.amount;
}

/**
 * Calculate full budget summary for a planner
 */
export function calculateBudgetSummary(
  members: PlannerMember[],
  goals: GoalDocument[],
  ratioMode: RatioMode,
  customRatios?: Record<string, number> | null,
  currentUserId?: string
): BudgetSummary {
  // Calculate CPF for each member
  const membersWithCPF: MemberWithCPF[] = members.map((member) => ({
    ...member,
    cpf:
      member.age && member.monthlyIncome
        ? calculateCPFContributions(member.age, member.monthlyIncome)
        : {
            employeeContribution: 0,
            employerContribution: 0,
            totalContribution: 0,
            ordinaryAccount: 0,
            specialAccount: 0,
            medisaveAccount: 0,
            takeHomePay: 0,
          },
  }));

  // Calculate ratios
  const ratios = calculateRatios(membersWithCPF, ratioMode, customRatios);

  // Initialize member summaries
  const memberSummaries: Record<string, MemberBudgetSummary> = {};
  for (const member of membersWithCPF) {
    const userId = member.userId.toString();
    memberSummaries[userId] = {
      userId,
      displayName: member.displayName ?? null,
      monthlyIncome: member.monthlyIncome ?? 0,
      takeHome: member.cpf.takeHomePay,
      cpfOaMonthly: member.cpf.ordinaryAccount,
      ratioPercentage: Math.round(ratios[userId] * 100),
      totalAllocations: 0,
      cpfOaUsed: 0,
      cashUsed: 0,
      remaining: member.cpf.takeHomePay,
      cpfOaRemaining: member.cpf.ordinaryAccount,
      goalBreakdown: [],
    };
  }

  // Process each goal
  for (const goal of goals) {
    const monthlyAmount = getMonthlyAmount(goal);

    if (goal.ownerType === GoalOwnerType.SHARED) {
      // Shared goal: split by ratio
      for (const member of membersWithCPF) {
        const userId = member.userId.toString();
        const summary = memberSummaries[userId];
        const memberShare = monthlyAmount * ratios[userId];

        let fromCpfOa = 0;
        let fromTakeHome = memberShare;

        // If CPF eligible, use CPF OA first
        if (goal.isCpfEligible && summary.cpfOaRemaining > 0) {
          fromCpfOa = Math.min(memberShare, summary.cpfOaRemaining);
          fromTakeHome = memberShare - fromCpfOa;
          summary.cpfOaUsed += fromCpfOa;
          summary.cpfOaRemaining -= fromCpfOa;
        }

        summary.cashUsed += fromTakeHome;
        summary.totalAllocations += memberShare;
        summary.remaining -= fromTakeHome;

        summary.goalBreakdown.push({
          goalId: goal._id.toString(),
          goalName: goal.name,
          monthlyAmount: memberShare,
          fromTakeHome,
          fromCpfOa,
          ownerType: goal.ownerType,
        });
      }
    } else {
      // Individual goal (USER or PARTNER)
      // Determine which member owns this goal
      let ownerUserId: string | null = null;

      if (goal.ownerUserId) {
        ownerUserId = goal.ownerUserId.toString();
      } else if (goal.ownerType === GoalOwnerType.USER && currentUserId) {
        ownerUserId = currentUserId;
      } else if (goal.ownerType === GoalOwnerType.PARTNER && currentUserId) {
        // Find the other member
        const partner = membersWithCPF.find(
          (m) => m.userId.toString() !== currentUserId
        );
        ownerUserId = partner?.userId.toString() ?? null;
      }

      if (ownerUserId && memberSummaries[ownerUserId]) {
        const summary = memberSummaries[ownerUserId];

        let fromCpfOa = 0;
        let fromTakeHome = monthlyAmount;

        // If CPF eligible, use CPF OA first
        if (goal.isCpfEligible && summary.cpfOaRemaining > 0) {
          fromCpfOa = Math.min(monthlyAmount, summary.cpfOaRemaining);
          fromTakeHome = monthlyAmount - fromCpfOa;
          summary.cpfOaUsed += fromCpfOa;
          summary.cpfOaRemaining -= fromCpfOa;
        }

        summary.cashUsed += fromTakeHome;
        summary.totalAllocations += monthlyAmount;
        summary.remaining -= fromTakeHome;

        summary.goalBreakdown.push({
          goalId: goal._id.toString(),
          goalName: goal.name,
          monthlyAmount,
          fromTakeHome,
          fromCpfOa,
          ownerType: goal.ownerType,
        });
      }
    }
  }

  // Calculate combined totals
  const memberList = Object.values(memberSummaries);
  const combinedTakeHome = memberList.reduce((sum, m) => sum + m.takeHome, 0);
  const combinedAllocations = memberList.reduce(
    (sum, m) => sum + m.totalAllocations,
    0
  );
  const combinedRemaining = memberList.reduce((sum, m) => sum + m.remaining, 0);
  const combinedCpfOaUsed = memberList.reduce((sum, m) => sum + m.cpfOaUsed, 0);

  return {
    members: memberList,
    combinedTakeHome,
    combinedAllocations,
    combinedRemaining,
    combinedCpfOaUsed,
  };
}

/**
 * Format currency in SGD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
