"use client";

import type { GetPlannerQuery } from "../Planner.api";
import { PlannerDetailsCard } from "./settingsTab/PlannerDetailsCard";
import { MembersCard } from "./settingsTab/MembersCard";
import { DangerZoneCard } from "./settingsTab/DangerZoneCard";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;

interface SettingsTabProps {
  plannerId: string;
  planner: Planner;
  plannerCode: string;
  onUpdate: () => void;
}

export const SettingsTab = ({
  plannerId,
  planner,
  plannerCode,
}: SettingsTabProps) => {
  return (
    <div className="space-y-6">
      <PlannerDetailsCard
        plannerName={planner.name}
        plannerCode={plannerCode}
      />
      <MembersCard members={planner.members} />
      <DangerZoneCard plannerId={plannerId} />
    </div>
  );
};

export default SettingsTab;
