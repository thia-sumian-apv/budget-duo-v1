import type { GetPlannerQuery } from "../../Planner.api";

// Re-export from canonical source
export { FLOW_TYPE_CONFIG, FLOW_TYPES, type FlowType } from "@/lib/utils/flowTypes";

export type Goal = NonNullable<GetPlannerQuery["getPlanner"]>["goals"][0];

export type ViewMode = "overall" | "you" | "partner";

export interface ViewState {
  totals: Record<string, number>;
  income: number;
}

export interface ViewDataMap {
  overall: ViewState;
  you?: ViewState;
  partner?: ViewState;
}

export interface FlowTypeBreakdownProps {
  flowTypeTotals: Record<string, number>;
  currentFlowTypeTotals?: Record<string, number>;
  partnerFlowTypeTotals?: Record<string, number>;
  goalsByFlowType: Record<string, Goal[]>;
  combinedTakeHome: number;
  currentTakeHome?: number;
  partnerTakeHome?: number;
  currentUserId: string | null;
  currentName?: string;
  partnerName: string;
  hasPartner?: boolean;
}
