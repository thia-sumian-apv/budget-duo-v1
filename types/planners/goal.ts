import type { ObjectId } from "mongodb";

export enum GoalCategory {
  MONTHLY = "MONTHLY", // recurring monthly expense
  GOAL = "GOAL", // time-bound goal with target amount
}

export enum GoalOwnerType {
  USER = "USER", // current user's individual goal
  PARTNER = "PARTNER", // partner's individual goal
  SHARED = "SHARED", // shared between both members
}

export enum GoalFlowType {
  EXPENSE = "EXPENSE", // spending (e.g., groceries, utilities)
  SAVINGS = "SAVINGS", // saving for something
  INVESTMENT = "INVESTMENT", // investing (stocks, property, etc.)
}

export interface GoalDocument {
  _id: ObjectId;
  plannerId: ObjectId;
  name: string;
  amount: number; // total amount (or monthly if category=MONTHLY)
  category: GoalCategory; // MONTHLY or GOAL
  duration?: number | null; // months (if category=GOAL)
  startDate?: string | null; // YYYY-MM format for time-bound goals
  ownerType: GoalOwnerType; // USER, PARTNER, or SHARED
  ownerUserId?: ObjectId | null; // for individual goals (USER/PARTNER)
  flowType: GoalFlowType; // EXPENSE, SAVINGS, or INVESTMENT
  isCpfEligible: boolean; // user toggle: deduct from CPF OA if true
  remarks?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
