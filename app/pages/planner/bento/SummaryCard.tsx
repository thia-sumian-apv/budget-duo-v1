"use client";

import { useMemo, useState } from "react";
import { X, User, Users } from "lucide-react";
import type { GetPlannerQuery } from "../Planner.api";
import { RatioMode, GoalOwnerType, GoalFlowType } from "@/app/apolloClient.types";
import { formatCurrency } from "@/lib/utils/budget";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
type Member = Planner["members"][number];
type Goal = Planner["goals"][number];
type CustomRatio = { userId: string; percentage: number };

interface SummaryCardProps {
  members: Member[];
  goals: Goal[];
  ratioMode: RatioMode;
  customRatios: CustomRatio[] | null | undefined;
  currentUserId: string | null;
}

interface GoalAllocation {
  goalId: string;
  goalName: string;
  flowType: GoalFlowType;
  ownerType: GoalOwnerType;
  amount: number;
  fromCash: number;
  fromCpfOa: number;
}

interface FlowTypeBreakdown {
  expense: number;
  savings: number;
  investment: number;
}

interface MemberSummary {
  userId: string;
  displayName: string;
  takeHome: number;
  cpfOaMonthly: number;
  ratioPercentage: number;
  totalAllocations: number;
  cpfOaUsed: number;
  remaining: number;
  cpfOaRemaining: number;
  goalAllocations: GoalAllocation[];
  flowBreakdown: FlowTypeBreakdown;
}

const flowTypeColors = {
  [GoalFlowType.Expense]: "text-red-600",
  [GoalFlowType.Savings]: "text-green-600",
  [GoalFlowType.Investment]: "text-blue-600",
};

const flowTypeBgColors = {
  [GoalFlowType.Expense]: "bg-red-50",
  [GoalFlowType.Savings]: "bg-green-50",
  [GoalFlowType.Investment]: "bg-blue-50",
};

const flowTypeLabels = {
  [GoalFlowType.Expense]: "Expense",
  [GoalFlowType.Savings]: "Savings",
  [GoalFlowType.Investment]: "Investment",
};

// Modal component for detailed breakdown
const BreakdownModal = ({
  member,
  isCurrentUser,
  onClose,
}: {
  member: MemberSummary;
  isCurrentUser: boolean;
  onClose: () => void;
}) => {
  const personalGoals = member.goalAllocations.filter(
    (a) => a.ownerType !== GoalOwnerType.Shared
  );
  const sharedGoals = member.goalAllocations.filter(
    (a) => a.ownerType === GoalOwnerType.Shared
  );
  const totalFromCash = member.goalAllocations.reduce((sum, a) => sum + a.fromCash, 0);
  const totalFromCpf = member.goalAllocations.reduce((sum, a) => sum + a.fromCpfOa, 0);

  return (
    <div className="fixed inset-0 bg-navy/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-navy/10 w-full max-w-md max-h-[70vh] flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-navy/10 shrink-0">
          <div>
            <h2 className="font-heading text-base font-semibold text-navy">
              {member.displayName}
              {isCurrentUser && (
                <span className="ml-1 text-xs text-navy/50">(You)</span>
              )}
            </h2>
            <p className="text-xs text-navy/50 mt-0.5">Monthly Budget Breakdown</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-navy/50 hover:text-navy/70 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Summary Header */}
          <div className="rounded-lg bg-base/50 border border-navy/10 p-3 mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-navy/50 text-xs">Take-home Pay</div>
                <div className="font-medium">{formatCurrency(member.takeHome)}</div>
              </div>
              <div>
                <div className="text-navy/50 text-xs">Total Allocations</div>
                <div className="font-medium text-highlight">
                  -{formatCurrency(member.totalAllocations)}
                </div>
              </div>
              <div>
                <div className="text-navy/50 text-xs">From Cash</div>
                <div className="font-medium">{formatCurrency(totalFromCash)}</div>
              </div>
              {totalFromCpf > 0 && (
                <div>
                  <div className="text-navy/50 text-xs">From CPF OA</div>
                  <div className="font-medium text-purple-600">
                    {formatCurrency(totalFromCpf)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal Goals */}
          {personalGoals.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-xs text-navy/60 mb-2">
                <User className="h-3.5 w-3.5" />
                <span className="font-medium">Personal Goals</span>
                <span className="text-navy/40">({personalGoals.length})</span>
              </div>
              <div className="space-y-2">
                {personalGoals.map((alloc) => (
                  <div
                    key={alloc.goalId}
                    className={`flex justify-between items-center text-sm px-3 py-2 rounded-lg ${flowTypeBgColors[alloc.flowType]}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{alloc.goalName}</div>
                      <div className={`text-xs ${flowTypeColors[alloc.flowType]} opacity-70`}>
                        {flowTypeLabels[alloc.flowType]}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className={`font-medium ${flowTypeColors[alloc.flowType]}`}>
                        -{formatCurrency(alloc.amount)}
                      </div>
                      {alloc.fromCpfOa > 0 && (
                        <div className="text-xs text-purple-600/70">
                          {formatCurrency(alloc.fromCpfOa)} CPF
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Goals */}
          {sharedGoals.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs text-navy/60 mb-2">
                <Users className="h-3.5 w-3.5" />
                <span className="font-medium">Shared Goals</span>
                <span className="text-navy/40">
                  ({sharedGoals.length} • {member.ratioPercentage}% share)
                </span>
              </div>
              <div className="space-y-2">
                {sharedGoals.map((alloc) => (
                  <div
                    key={alloc.goalId}
                    className={`flex justify-between items-center text-sm px-3 py-2 rounded-lg ${flowTypeBgColors[alloc.flowType]}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{alloc.goalName}</div>
                      <div className={`text-xs ${flowTypeColors[alloc.flowType]} opacity-70`}>
                        {flowTypeLabels[alloc.flowType]}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className={`font-medium ${flowTypeColors[alloc.flowType]}`}>
                        -{formatCurrency(alloc.amount)}
                      </div>
                      {alloc.fromCpfOa > 0 && (
                        <div className="text-xs text-purple-600/70">
                          {formatCurrency(alloc.fromCpfOa)} CPF
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-navy/10 shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-sm text-navy/70">Remaining for personal use</span>
            <span
              className={`text-lg font-semibold ${
                member.remaining >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(member.remaining)}/mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({
  members,
  goals,
  ratioMode,
  customRatios,
  currentUserId,
}: SummaryCardProps) => {
  const [selectedMember, setSelectedMember] = useState<MemberSummary | null>(null);

  const summary = useMemo(() => {
    const totalTakeHome = members.reduce(
      (sum, m) => sum + (m.cpfBreakdown?.takeHomePay ?? 0),
      0
    );

    const ratios: Record<string, number> = {};
    if (ratioMode === RatioMode.Custom && customRatios) {
      for (const r of customRatios) {
        ratios[r.userId] = r.percentage / 100;
      }
    } else if (totalTakeHome > 0) {
      for (const m of members) {
        const takeHome = m.cpfBreakdown?.takeHomePay ?? 0;
        ratios[m.user.id] = takeHome / totalTakeHome;
      }
    } else {
      const equalRatio = 1 / members.length;
      for (const m of members) {
        ratios[m.user.id] = equalRatio;
      }
    }

    const memberSummaries: Record<string, MemberSummary> = {};
    for (const m of members) {
      const cpf = m.cpfBreakdown;
      memberSummaries[m.user.id] = {
        userId: m.user.id,
        displayName: m.displayName || m.user.name || "Member",
        takeHome: cpf?.takeHomePay ?? 0,
        cpfOaMonthly: cpf?.ordinaryAccount ?? 0,
        ratioPercentage: Math.round(ratios[m.user.id] * 100),
        totalAllocations: 0,
        cpfOaUsed: 0,
        remaining: cpf?.takeHomePay ?? 0,
        cpfOaRemaining: cpf?.ordinaryAccount ?? 0,
        goalAllocations: [],
        flowBreakdown: { expense: 0, savings: 0, investment: 0 },
      };
    }

    for (const goal of goals) {
      const monthlyAmount = goal.monthlyAmount;

      if (goal.ownerType === GoalOwnerType.Shared) {
        for (const m of members) {
          const memberSum = memberSummaries[m.user.id];
          const memberShare = monthlyAmount * ratios[m.user.id];

          let fromCpfOa = 0;
          let fromCash = memberShare;

          if (goal.isCpfEligible && memberSum.cpfOaRemaining > 0) {
            fromCpfOa = Math.min(memberShare, memberSum.cpfOaRemaining);
            fromCash = memberShare - fromCpfOa;
            memberSum.cpfOaUsed += fromCpfOa;
            memberSum.cpfOaRemaining -= fromCpfOa;
          }

          memberSum.totalAllocations += memberShare;
          memberSum.remaining -= fromCash;

          memberSum.goalAllocations.push({
            goalId: goal.id,
            goalName: goal.name,
            flowType: goal.flowType,
            ownerType: goal.ownerType,
            amount: memberShare,
            fromCash,
            fromCpfOa,
          });

          if (goal.flowType === GoalFlowType.Expense) {
            memberSum.flowBreakdown.expense += memberShare;
          } else if (goal.flowType === GoalFlowType.Savings) {
            memberSum.flowBreakdown.savings += memberShare;
          } else if (goal.flowType === GoalFlowType.Investment) {
            memberSum.flowBreakdown.investment += memberShare;
          }
        }
      } else {
        let ownerUserId = goal.owner?.id;

        if (!ownerUserId) {
          if (goal.ownerType === GoalOwnerType.User) {
            ownerUserId = currentUserId ?? undefined;
          } else if (goal.ownerType === GoalOwnerType.Partner) {
            const partner = members.find((m) => m.user.id !== currentUserId);
            ownerUserId = partner?.user.id;
          }
        }

        if (ownerUserId && memberSummaries[ownerUserId]) {
          const memberSum = memberSummaries[ownerUserId];

          let fromCpfOa = 0;
          let fromCash = monthlyAmount;

          if (goal.isCpfEligible && memberSum.cpfOaRemaining > 0) {
            fromCpfOa = Math.min(monthlyAmount, memberSum.cpfOaRemaining);
            fromCash = monthlyAmount - fromCpfOa;
            memberSum.cpfOaUsed += fromCpfOa;
            memberSum.cpfOaRemaining -= fromCpfOa;
          }

          memberSum.totalAllocations += monthlyAmount;
          memberSum.remaining -= fromCash;

          memberSum.goalAllocations.push({
            goalId: goal.id,
            goalName: goal.name,
            flowType: goal.flowType,
            ownerType: goal.ownerType,
            amount: monthlyAmount,
            fromCash,
            fromCpfOa,
          });

          if (goal.flowType === GoalFlowType.Expense) {
            memberSum.flowBreakdown.expense += monthlyAmount;
          } else if (goal.flowType === GoalFlowType.Savings) {
            memberSum.flowBreakdown.savings += monthlyAmount;
          } else if (goal.flowType === GoalFlowType.Investment) {
            memberSum.flowBreakdown.investment += monthlyAmount;
          }
        }
      }
    }

    const memberList = Object.values(memberSummaries);

    const combinedFlowBreakdown: FlowTypeBreakdown = {
      expense: memberList.reduce((sum, m) => sum + m.flowBreakdown.expense, 0),
      savings: memberList.reduce((sum, m) => sum + m.flowBreakdown.savings, 0),
      investment: memberList.reduce((sum, m) => sum + m.flowBreakdown.investment, 0),
    };

    return {
      members: memberList,
      combinedTakeHome: memberList.reduce((sum, m) => sum + m.takeHome, 0),
      combinedAllocations: memberList.reduce((sum, m) => sum + m.totalAllocations, 0),
      combinedRemaining: memberList.reduce((sum, m) => sum + m.remaining, 0),
      combinedCpfOaUsed: memberList.reduce((sum, m) => sum + m.cpfOaUsed, 0),
      combinedFlowBreakdown,
    };
  }, [members, goals, ratioMode, customRatios, currentUserId]);

  return (
    <div className="rounded-xl border border-navy/10 bg-white/50 p-4">
      <h3 className="font-heading text-sm font-semibold mb-3 text-navy/80">
        Monthly Budget Summary
      </h3>

      <div className="flex gap-4">
        {summary.members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const hasAllocations = member.goalAllocations.length > 0;

          return (
            <button
              key={member.userId}
              type="button"
              onClick={() => hasAllocations && setSelectedMember(member)}
              className={`flex-1 text-left rounded-lg border border-navy/10 bg-white/70 p-3 transition ${
                hasAllocations
                  ? "cursor-pointer hover:bg-white hover:border-navy/20"
                  : "cursor-default"
              }`}
            >
              <div className="text-sm font-medium mb-2">
                {member.displayName}
                {isCurrentUser && (
                  <span className="ml-1 text-xs text-navy/50">(You)</span>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-navy/60">
                  <span>Take-home</span>
                  <span>{formatCurrency(member.takeHome)}</span>
                </div>

                {member.flowBreakdown.expense > 0 && (
                  <div className="flex justify-between">
                    <span className="text-red-600/70">- Expenses</span>
                    <span className="text-red-600">
                      -{formatCurrency(member.flowBreakdown.expense)}
                    </span>
                  </div>
                )}
                {member.flowBreakdown.savings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600/70">- Savings</span>
                    <span className="text-green-600">
                      -{formatCurrency(member.flowBreakdown.savings)}
                    </span>
                  </div>
                )}
                {member.flowBreakdown.investment > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-600/70">- Investments</span>
                    <span className="text-blue-600">
                      -{formatCurrency(member.flowBreakdown.investment)}
                    </span>
                  </div>
                )}

                <div className="border-t border-navy/10 pt-1.5 flex justify-between font-medium">
                  <span>= Remaining</span>
                  <span
                    className={
                      member.remaining >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {formatCurrency(member.remaining)}
                  </span>
                </div>
                {member.cpfOaUsed > 0 && (
                  <div className="flex justify-between text-purple-600/80 mt-1">
                    <span>CPF OA used</span>
                    <span>{formatCurrency(member.cpfOaUsed)}</span>
                  </div>
                )}

                {hasAllocations && (
                  <div className="text-[10px] text-highlight mt-2 text-center">
                    Click for details
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Combined summary */}
      <div className="mt-4 pt-3 border-t border-navy/10">
        <div className="flex gap-4 mb-3 text-xs">
          {summary.combinedFlowBreakdown.expense > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-navy/50">Expenses:</span>
              <span className="text-red-600 font-medium">
                {formatCurrency(summary.combinedFlowBreakdown.expense)}
              </span>
            </div>
          )}
          {summary.combinedFlowBreakdown.savings > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-navy/50">Savings:</span>
              <span className="text-green-600 font-medium">
                {formatCurrency(summary.combinedFlowBreakdown.savings)}
              </span>
            </div>
          )}
          {summary.combinedFlowBreakdown.investment > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-navy/50">Investments:</span>
              <span className="text-blue-600 font-medium">
                {formatCurrency(summary.combinedFlowBreakdown.investment)}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-navy/60">Combined Remaining</span>
          <span
            className={`text-lg font-semibold ${
              summary.combinedRemaining >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(summary.combinedRemaining)}/month
          </span>
        </div>
        {summary.combinedCpfOaUsed > 0 && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-navy/50">
              Total CPF OA used for goals
            </span>
            <span className="text-sm text-purple-600">
              {formatCurrency(summary.combinedCpfOaUsed)}
            </span>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMember && (
        <BreakdownModal
          member={selectedMember}
          isCurrentUser={selectedMember.userId === currentUserId}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};

export default SummaryCard;
