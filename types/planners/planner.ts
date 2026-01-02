import type { ObjectId } from "mongodb";

export enum PlannerMemberRole {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
}

export enum RatioMode {
  INCOME_BASED = "INCOME_BASED",
  CUSTOM = "CUSTOM",
}

export interface PlannerMember {
  userId: ObjectId;
  joinedAt: Date;
  role: PlannerMemberRole;
  displayName?: string | null;
  age?: number | null;
  monthlyIncome?: number | null;
}

export interface PlannerDocument {
  _id: ObjectId;
  name: string;
  code: string;
  members: PlannerMember[];
  ratioMode: RatioMode;
  customRatios?: Record<string, number> | null; // { [userId]: percentage (0-100) }
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
