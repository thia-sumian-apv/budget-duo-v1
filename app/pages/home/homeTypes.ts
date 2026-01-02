export type Feature = "none" | "budget" | "cashflow" | "profile" | "planners";

export interface ExpandedPlannerState {
  plannerId: string;
  plannerName: string;
  plannerCode: string;
}
