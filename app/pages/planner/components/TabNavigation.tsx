"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Wallet, Target, Settings } from "lucide-react";

export type PlannerTab = "dashboard" | "income" | "goals" | "settings";

interface TabNavigationProps {
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

export const TabNavigation = ({
  activeTab,
  onTabChange,
  className,
}: TabNavigationProps) => {
  return (
    <nav className={cn("border-b border-navy/10", className)}>
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-highlight"
                : "text-navy/60 hover:text-navy"
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {/* Active indicator line */}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-highlight" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;
