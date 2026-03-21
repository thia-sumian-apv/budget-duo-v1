import type { GetPlannerQuery } from "../../Planner.api";
import {
  GoalCategory,
  GoalOwnerType,
  GoalFlowType,
} from "@/app/apolloClient.types";

export { GoalCategory, GoalOwnerType, GoalFlowType };

export type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
export type Goal = Planner["goals"][0];
export type PlannerMember = Planner["members"][0];

export type FormStep = 1 | 2;

export interface GoalFormState {
  step: FormStep;
  name: string;
  amount: string;
  flowType: GoalFlowType;
  category: GoalCategory;
  ownerType: GoalOwnerType;
  duration: string;
  startDate: string;
  isCpfEligible: boolean;
  remarks: string;
}

export interface GoalSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  plannerId: string;
  goal: Goal | null;
  members: PlannerMember[];
  onSuccess: () => void;
}
