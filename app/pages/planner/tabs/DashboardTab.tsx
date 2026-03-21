"use client";

import { motion } from "framer-motion";
import { HealthSummaryCard } from "../components/HealthIndicator";
import { MemberSummaryCard } from "../components/MemberSummaryCard";
import { useBudgetSummary } from "../hooks/useBudgetSummary";
import { GoalCount } from "../components/GoalCount";
import { getMemberName, getInitial } from "@/lib/utils/member";
import type { GetPlannerQuery } from "../Planner.api";
import { FlowTypeBreakdown } from "../components/flowTypeBreakdown/FlowTypeBreakdown";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;

interface DashboardTabProps {
  planner: Planner;
  currentUserId: string | null;
}

export const DashboardTab = ({ planner, currentUserId }: DashboardTabProps) => {
  const summary = useBudgetSummary({ planner, currentUserId });

  const currentName = getMemberName(summary.currentMember, "You");
  const currentInitial = getInitial(currentName, "Y");

  const partnerName = getMemberName(summary.partnerMember, "Partner");
  const partnerInitial = getInitial(partnerName, "P");

  return (
    <div className="space-y-6">
      {/* Hero Card — full width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <HealthSummaryCard
          remainingAmount={summary.combinedRemaining}
          totalIncome={summary.combinedTakeHome}
        />
      </motion.div>

      {/* Bento Grid: Flow Breakdown (7/12) + Member Cards (5/12) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Flow Type Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-7"
        >
          <FlowTypeBreakdown
            flowTypeTotals={summary.flowTypeTotals}
            currentFlowTypeTotals={summary.currentFlowTypeTotals}
            partnerFlowTypeTotals={summary.partnerFlowTypeTotals}
            goalsByFlowType={summary.goalsByFlowType}
            combinedTakeHome={summary.combinedTakeHome}
            currentTakeHome={summary.currentTakeHome}
            partnerTakeHome={summary.partnerTakeHome}
            currentUserId={currentUserId}
            currentName={currentName}
            partnerName={partnerName}
            hasPartner={!!summary.partnerMember}
          />
        </motion.div>

        {/* Member Summary Cards — stacked in right column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="md:col-span-5 space-y-4"
        >
          <MemberSummaryCard
            name={currentName}
            initial={currentInitial}
            remaining={summary.currentRemaining}
            isCurrentUser
            contributionPercent={summary.currentRatio * 100}
          />
          {summary.partnerMember && (
            <MemberSummaryCard
              name={partnerName}
              initial={partnerInitial}
              remaining={summary.partnerRemaining}
              contributionPercent={summary.partnerRatio * 100}
            />
          )}
        </motion.div>
      </div>

      <GoalCount total={summary.goalCount} />
    </div>
  );
};

export default DashboardTab;
