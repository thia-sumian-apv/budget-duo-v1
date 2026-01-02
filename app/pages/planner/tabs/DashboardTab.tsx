"use client";

import { motion } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthSummaryCard } from "../components/HealthIndicator";
import { FlowTypeBreakdown } from "../components/FlowTypeBreakdown";
import { MemberSummaryCard } from "../components/MemberSummaryCard";
import { useBudgetSummary } from "../hooks/useBudgetSummary";
import type { GetPlannerQuery } from "../Planner.api";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;

interface DashboardTabProps {
  planner: Planner;
  currentUserId: string | null;
  onNavigateToGoals: () => void;
  onNavigateToIncome: () => void;
}

export const DashboardTab = ({
  planner,
  currentUserId,
  onNavigateToGoals,
  onNavigateToIncome,
}: DashboardTabProps) => {
  const summary = useBudgetSummary({ planner, currentUserId });

  const currentName =
    summary.currentMember?.displayName ||
    summary.currentMember?.user.name ||
    "You";
  const currentInitial = currentName[0] || "Y";

  const partnerName =
    summary.partnerMember?.displayName ||
    summary.partnerMember?.user.name ||
    "Partner";
  const partnerInitial = partnerName[0] || "P";

  return (
    <div className="space-y-6">
      {/* Health Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <HealthSummaryCard
          remainingAmount={summary.combinedRemaining}
          totalIncome={summary.combinedTakeHome}
        />
      </motion.div>

      {/* Flow Type Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <FlowTypeBreakdown
          flowTypeTotals={summary.flowTypeTotals}
          goalsByFlowType={summary.goalsByFlowType}
          combinedTakeHome={summary.combinedTakeHome}
          currentUserId={currentUserId}
          partnerName={partnerName}
        />
      </motion.div>

      {/* Member Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <MemberSummaryCard
          name={currentName}
          initial={currentInitial}
          remaining={summary.currentRemaining}
          isCurrentUser
        />
        {summary.partnerMember && (
          <MemberSummaryCard
            name={partnerName}
            initial={partnerInitial}
            remaining={summary.partnerRemaining}
          />
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        <Button
          onClick={onNavigateToGoals}
          className="rounded-full bg-highlight hover:bg-highlight/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
        <Button
          variant="ghost"
          onClick={onNavigateToIncome}
          className="rounded-full hover:bg-navy/5"
        >
          Adjust Contributions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      {/* Goals count */}
      {summary.goalCount > 0 && (
        <p className="text-xs text-navy/50">
          {summary.goalCount} goal{summary.goalCount !== 1 ? "s" : ""} tracked
        </p>
      )}
    </div>
  );
};

export default DashboardTab;
