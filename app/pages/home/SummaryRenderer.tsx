"use client";

import { motion } from "framer-motion";
import CashflowMonitorScreen from "./CashflowMonitorScreen";
import { useMemo } from "react";
import type { Feature, ExpandedPlannerState } from "./homeTypes";
import PlannersSummary from "./PlannersSummary";
import UserProfileSummary from "./UserProfileSummary";
import PlannerScreen from "../planner/PlannerScreen";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

export interface SummaryRendererProps {
  feature: Feature;
  onExpandPlanner?: (planner: ExpandedPlannerState) => void;
}

const SummaryRenderer = ({
  feature,
  onExpandPlanner,
}: SummaryRendererProps) => {
  const { userId } = useCurrentUser();

  const getScreen = useMemo(() => {
    switch (feature) {
      case "budget":
        return <PlannerScreen onExpandPlanner={onExpandPlanner} />;
      case "cashflow":
        return <CashflowMonitorScreen />;
      case "profile":
        if (!userId) {
          return <PlannersSummary />;
        }
        return <UserProfileSummary userId={userId} />;
      case "planners":
        return <PlannerScreen onExpandPlanner={onExpandPlanner} />;
      default:
        return <PlannersSummary />;
    }
  }, [feature, userId, onExpandPlanner]);

  return (
    <motion.div
      key={feature}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="rounded-xl border border-navy/10 bg-white/50 p-0"
    >
      {getScreen}
    </motion.div>
  );
};

export default SummaryRenderer;
