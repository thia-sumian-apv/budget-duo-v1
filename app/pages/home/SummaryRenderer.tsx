"use client";

import { motion } from "framer-motion";
import BudgetPlannerScreen from "./BudgetPlannerScreen";
import CashflowMonitorScreen from "./CashflowMonitorScreen";
import { useMemo } from "react";
import type { Feature } from "./homeTypes";
import SummaryPlaceholder from "./SummaryPlaceholder";
import UserProfileSummary from "./UserProfileSummary";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

export interface SummaryRendererProps {
  feature: Feature;
}

const SummaryRenderer = ({ feature }: SummaryRendererProps) => {
  const { userId } = useCurrentUser();

  const getScreen = useMemo(() => {
    switch (feature) {
      case "budget":
        return <BudgetPlannerScreen />;
      case "cashflow":
        return <CashflowMonitorScreen />;
      case "profile":
        if (!userId) {
          return <SummaryPlaceholder />;
        }
        return <UserProfileSummary userId={userId} />;
      default:
        return <SummaryPlaceholder />;
    }
  }, [feature, userId]);

  return (
    <motion.div
      key={feature}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="rounded-xl border border-white/10 bg-white/[0.02] p-0"
    >
      {getScreen}
    </motion.div>
  );
};

export default SummaryRenderer;
