import type { GetPlannerQuery } from "../../Planner.api";

export type Goal = NonNullable<GetPlannerQuery["getPlanner"]>["goals"][0];

export interface Contributions {
  current: number;
  partner: number;
  isShared: boolean;
}

export interface Ratios {
  currentRatio: number;
  partnerRatio: number;
}

export interface GoalListItemProps {
  goal: Goal;
  isExpanded: boolean;
  onToggleExpand: () => void;
  canEdit: boolean;
  hasPartner: boolean;
  contributions: Contributions;
  ratios: Ratios;
  currentName: string;
  partnerName: string;
  ownerLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}
