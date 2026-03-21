import type { GetPlannerQuery } from "../../Planner.api";

export type PlannerMember = NonNullable<
  GetPlannerQuery["getPlanner"]
>["members"][0];

export interface EditFormData {
  displayName: string;
  age: string;
  monthlyIncome: string;
}

export interface SaveData {
  displayName?: string;
  age: number;
  monthlyIncome: number;
}
