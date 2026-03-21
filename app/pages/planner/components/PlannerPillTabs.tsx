"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Wallet, Target, Settings } from "lucide-react";

export type PlannerTab = "dashboard" | "income" | "goals" | "settings";

interface PlannerPillTabsProps {
  activeTab: PlannerTab;
  onTabChange: (tab: PlannerTab) => void;
  className?: string;
}

const tabs: { id: PlannerTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "income", label: "Income", icon: <Wallet className="h-4 w-4" /> },
  { id: "goals", label: "Goals", icon: <Target className="h-4 w-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

export const PlannerPillTabs = ({
  activeTab,
  onTabChange,
  className,
}: PlannerPillTabsProps) => {
  return (
    <nav className={cn("flex gap-2 mb-8", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
            activeTab === tab.id
              ? "bg-highlight text-white shadow-sm"
              : "text-navy/60 hover:text-navy hover:bg-navy/5"
          )}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default PlannerPillTabs;
