"use client";

import { useState } from "react";
import { Lock, ChevronRight, ArrowLeft, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import SummaryRenderer from "./SummaryRenderer";
import PlannerDetailView from "../planner/PlannerDetailView";
import type { Feature, ExpandedPlannerState } from "./homeTypes";
import { formatPlannerCode } from "@/lib/utils/plannerCode";

const Card = ({
  title,
  description,
  onClick,
  icon,
  locked = false,
  selected = false,
}: {
  title: string;
  description: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  locked?: boolean;
  selected?: boolean;
}) => (
  <button
    type="button"
    onClick={locked ? undefined : onClick}
    className={`w-full text-left rounded-xl border p-4 transition ${
      selected
        ? "border-navy/10 bg-white/50 hover:bg-white/70"
        : "border-highlight/40 bg-highlight/10"
    } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-heading text-base font-semibold text-navy">
            {title}
          </span>
          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-navy/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-navy/70">
              <Lock className="h-3 w-3" /> Locked
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-navy/70">{description}</p>
      </div>
      <div className="shrink-0 text-highlight">{icon}</div>
    </div>
  </button>
);

const PlannerHeader = ({
  planner,
  onBack,
}: {
  planner: ExpandedPlannerState;
  onBack: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(planner.plannerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-highlight/40 bg-highlight/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg p-1.5 hover:bg-navy/10 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-semibold text-navy">
              {planner.plannerName}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-navy/50">
                Code: {formatPlannerCode(planner.plannerCode)}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="text-navy/50 hover:text-navy/70 transition"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  // When a planner is expanded, show the bento layout with header on top
  if (expandedPlanner) {
    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(237,152,95,0.12)_0%,rgba(230,230,230,0)_70%)]" />
          <div className="absolute -bottom-14 -right-8 h-72 w-72 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(247,185,128,0.08)_0%,rgba(230,230,230,0)_70%)]" />
        </div>
        <div className="relative flex flex-col gap-4">
          {/* Header row - full width */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PlannerHeader
              planner={expandedPlanner}
              onBack={handleCollapsePlanner}
            />
          </motion.div>

          {/* Bento layout - full width below header */}
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

  // Normal dashboard view
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(237,152,95,0.12)_0%,rgba(230,230,230,0)_70%)]" />
        <div className="absolute -bottom-14 -right-8 h-72 w-72 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(247,185,128,0.08)_0%,rgba(230,230,230,0)_70%)]" />
      </div>
      <div className="relative flex flex-col gap-4 md:flex-row">
        <div
          className={`space-y-3 md:min-w-[280px] ${
            selected === "none" ? "md:basis-2/3" : "md:basis-1/3"
          }`}
        >
          <Card
            title="Budget Planner"
            description="Plan CPF-aware goals or pick up where you left off."
            onClick={() => toggle("planners")}
            icon={<ChevronRight className="h-5 w-5" />}
            selected={selected === "planners"}
          />
          <Card
            title="Profile"
            description="View your profile summary."
            onClick={() => toggle("profile")}
            icon={<ChevronRight className="h-5 w-5" />}
            selected={selected === "profile"}
          />
          <Card
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
