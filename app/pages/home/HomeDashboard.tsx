"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import SummaryRenderer from "./SummaryRenderer";
import PlannerDetailView from "../planner/PlannerDetailView";
import { FeatureCard, PlannerHeader } from "./components";
import type { Feature, ExpandedPlannerState } from "./homeTypes";

const BackgroundGradients = () => (
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(237,152,95,0.12)_0%,rgba(230,230,230,0)_70%)]" />
    <div className="absolute -bottom-14 -right-8 h-72 w-72 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(247,185,128,0.08)_0%,rgba(230,230,230,0)_70%)]" />
  </div>
);

const HomeDashboard = () => {
  const [selected, setSelected] = useState<Feature>("none");
  const [expandedPlanner, setExpandedPlanner] =
    useState<ExpandedPlannerState | null>(null);

  const toggle = (feature: Exclude<Feature, "none">) =>
    setSelected((prev) => (prev === feature ? "none" : feature));

  const handleExpandPlanner = (planner: ExpandedPlannerState) => {
    setExpandedPlanner(planner);
    setSelected("planners");
  };

  const handleCollapsePlanner = () => {
    setExpandedPlanner(null);
  };

  if (expandedPlanner) {
    return (
      <div className="relative">
        <BackgroundGradients />
        <div className="relative flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PlannerHeader
              planner={expandedPlanner}
              onBack={handleCollapsePlanner}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <PlannerDetailView plannerId={expandedPlanner.plannerId} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <BackgroundGradients />
      <div className="relative flex flex-col gap-4 md:flex-row">
        <div
          className={`space-y-3 md:min-w-[280px] ${
            selected === "none" ? "md:basis-2/3" : "md:basis-1/3"
          }`}
        >
          <FeatureCard
            title="Budget Planner"
            description="Plan CPF-aware goals or pick up where you left off."
            onClick={() => toggle("planners")}
            icon={<ChevronRight className="h-5 w-5" />}
            selected={selected === "planners"}
          />
          <FeatureCard
            title="Profile"
            description="View your profile summary."
            onClick={() => toggle("profile")}
            icon={<ChevronRight className="h-5 w-5" />}
            selected={selected === "profile"}
          />
          <FeatureCard
            title="Cashflow Monitoring"
            description="Track balances and trends across accounts."
            locked
            onClick={() => toggle("cashflow")}
            icon={<ChevronRight className="h-5 w-5" />}
            selected={selected === "cashflow"}
          />
        </div>
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={`space-y-4 ${
            selected === "none" ? "md:basis-1/3" : "md:basis-2/3"
          }`}
        >
          <SummaryRenderer
            feature={selected}
            onExpandPlanner={handleExpandPlanner}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HomeDashboard;
