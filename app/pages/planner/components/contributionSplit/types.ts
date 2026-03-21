import type { GetPlannerQuery } from "../../Planner.api";
import { RatioMode } from "@/app/apolloClient.types";

export type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
export type PlannerMember = Planner["members"][0];

export { RatioMode };

export interface IncomeBasedData {
  current: number;
  partner: number;
  total: number;
}

export interface ContributionSplitSectionProps {
  members: PlannerMember[];
  currentUserId: string | null;
  ratioMode: RatioMode;
  customRatios: Planner["customRatios"];
  onRatioModeChange: (mode: RatioMode) => Promise<void>;
  onSaveCustomRatio: (
    ratios: { userId: string; percentage: number }[],
  ) => Promise<void>;
  isSaving: boolean;
}
