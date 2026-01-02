"use client";

import { useState } from "react";
import { useGetPlannerQuery } from "./Planner.api";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { TabNavigation, type PlannerTab } from "./components/TabNavigation";
import { usePlannerSetup } from "./hooks/usePlannerSetup";
import { SetupWizard } from "./wizard/SetupWizard";
import { DashboardTab } from "./tabs/DashboardTab";
import { IncomeTab } from "./tabs/IncomeTab";
import { GoalsTab } from "./tabs/GoalsTab";
import { SettingsTab } from "./tabs/SettingsTab";

interface PlannerDetailViewProps {
  plannerId: string;
  plannerName?: string;
  plannerCode?: string;
}

const PlannerDetailView = ({
  plannerId,
  plannerName,
  plannerCode,
}: PlannerDetailViewProps) => {
  const { userId: rawUserId } = useCurrentUser();
  const userId = rawUserId ?? null;
  const [activeTab, setActiveTab] = useState<PlannerTab>("dashboard");

  const { data, loading, error, refetch } = useGetPlannerQuery({
    variables: { id: plannerId },
    fetchPolicy: "cache-and-network",
  });

  const planner = data?.getPlanner;
  const setupStatus = usePlannerSetup(planner?.members ?? [], userId);

  if (loading && !data) {
    return (
      <div className="p-5 text-sm text-navy/70">Loading planner...</div>
    );
  }

  if (error || !planner) {
    return (
      <div className="p-5 text-sm text-red-600">
        Failed to load planner details
      </div>
    );
  }

  // Show setup wizard if user hasn't completed setup
  if (setupStatus.needsSetup) {
    return (
      <SetupWizard
        plannerId={plannerId}
        members={planner.members}
        currentUserId={userId}
        onComplete={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with planner name */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="font-heading text-xl font-bold text-navy">
          {plannerName || planner.name}
        </h1>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="px-5"
      />

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-5">
        {activeTab === "dashboard" && (
          <DashboardTab
            planner={planner}
            currentUserId={userId}
            onNavigateToGoals={() => setActiveTab("goals")}
            onNavigateToIncome={() => setActiveTab("income")}
          />
        )}
        {activeTab === "income" && (
          <IncomeTab
            plannerId={plannerId}
            planner={planner}
            currentUserId={userId}
            onUpdate={() => refetch()}
          />
        )}
        {activeTab === "goals" && (
          <GoalsTab
            plannerId={plannerId}
            planner={planner}
            currentUserId={userId}
            onUpdate={() => refetch()}
          />
        )}
        {activeTab === "settings" && (
          <SettingsTab
            plannerId={plannerId}
            planner={planner}
            plannerCode={plannerCode || planner.code}
            onUpdate={() => refetch()}
          />
        )}
      </div>
    </div>
  );
};

export default PlannerDetailView;
