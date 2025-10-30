"use client";

import { useState } from "react";
import { Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import SummaryRenderer from "./SummaryRenderer";
import type { Feature } from "./homeTypes";

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
        ? "border-[#3B82F6]/40 bg-[#3B82F6]/10"
        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
    } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">{title}</span>
          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
              <Lock className="h-3 w-3" /> Locked
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-white/70">{description}</p>
      </div>
      <div className="shrink-0 text-[#3B82F6]">{icon}</div>
    </div>
  </button>
);

const HomeDashboard = () => {
  const [selected, setSelected] = useState<Feature>("none");
  const toggle = (feature: Exclude<Feature, "none">) =>
    setSelected((prev) => (prev === feature ? "none" : feature));

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(59,130,246,0.12)_0%,rgba(0,0,0,0)_70%)]" />
        <div className="absolute -bottom-14 -right-8 h-72 w-72 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(59,130,246,0.08)_0%,rgba(0,0,0,0)_70%)]" />
      </div>
      <div className="relative flex flex-col gap-4 md:flex-row">
        <div
          className={`space-y-3 md:min-w-[280px] ${
            selected === "none" ? "md:basis-2/3" : "md:basis-1/3"
          }`}
        >
          <Card
            title="Budget Planner"
            description="Plan CPF‑aware goals or pick up where you left off."
            onClick={() => toggle("budget")}
            icon={<ChevronRight className="h-5 w-5" />}
            selected={selected === "budget"}
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
          <SummaryRenderer feature={selected} />
        </motion.div>
      </div>
    </div>
  );
};

export default HomeDashboard;
