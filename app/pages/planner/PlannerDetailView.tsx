"use client";

import { useRef, useState } from "react";
import { useGetPlannerQuery } from "./Planner.api";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { PlannerPillTabs, type PlannerTab } from "./components/PlannerPillTabs";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
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

  // Latch: once wizard is needed, keep it open until onComplete is called.
  // Without this, the updateMemberData mutation updates the Apollo cache which
  // flips needsSetup to false mid-wizard, dismissing it prematurely.
  // Only latch AFTER data has loaded to avoid false positives from empty members array.
  const wizardRequiredRef = useRef(false);
  const [wizardDismissed, setWizardDismissed] = useState(false);
  if (planner && userId && setupStatus.needsSetup) {
    wizardRequiredRef.current = true;
  }

  if (loading && !data) {
    return <div className="p-5 text-sm text-navy/70">Loading planner...</div>;
  }

  if (error || !planner) {
    return (
      <div className="p-5 text-sm text-red-600">
        Failed to load planner details
      </div>
    );
  }

  if (wizardRequiredRef.current && !wizardDismissed) {
    return (
      <SetupWizard
        plannerId={plannerId}
        plannerCode={planner.code}
        members={planner.members}
        currentUserId={userId}
        onComplete={() => {
          setWizardDismissed(true);
          refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Header — on grey background */}
      <PageHeader title={plannerName || planner.name} />

      {/* Pill Tab Navigation — on grey background */}
      <PlannerPillTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content — cards render directly on grey background */}
      <div>
        {activeTab === "dashboard" && (
          <DashboardTab planner={planner} currentUserId={userId} />
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
