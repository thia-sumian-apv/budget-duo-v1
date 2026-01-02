import type { GqlResolvers } from "@/graphql/__generated__/types";
import getUserCollections from "@/db/users/getCollections";
import getGoalCollections from "@/db/planners/goalCollections";
import getPlannerCollections from "@/db/planners/getCollections";
import { calculateCPFContributions } from "@/lib/utils/cpf";
import { RatioMode, GoalCategory } from "@/types";

const plannerTypes: GqlResolvers["Planner"] = {
  id: (parent) => parent._id,
  createdBy: async (parent) => {
    const { users } = await getUserCollections();
    const user = await users.findOne({ _id: parent.createdBy });
    if (!user) throw new Error(`User not found: ${parent.createdBy}`);
    return user;
  },
  members: (parent) => parent.members,
  ratioMode: (parent) => parent.ratioMode ?? RatioMode.INCOME_BASED,
  customRatios: (parent) => {
    if (!parent.customRatios) return null;
    return Object.entries(parent.customRatios).map(([userId, percentage]) => ({
      userId: userId as unknown as import("mongodb").ObjectId,
      percentage,
    }));
  },
  goals: async (parent) => {
    const { goals } = await getGoalCollections();
    return goals.find({ plannerId: parent._id }).toArray();
  },
  createdAt: (parent) => parent.createdAt.toISOString(),
  updatedAt: (parent) => parent.updatedAt.toISOString(),
};

const plannerMemberTypes: GqlResolvers["PlannerMember"] = {
  user: async (parent) => {
    const { users } = await getUserCollections();
    const user = await users.findOne({ _id: parent.userId });
    if (!user) throw new Error(`User not found: ${parent.userId}`);
    return user;
  },
  joinedAt: (parent) => parent.joinedAt.toISOString(),
  role: (parent) => parent.role,
  displayName: (parent) => parent.displayName ?? null,
  age: (parent) => parent.age ?? null,
  monthlyIncome: (parent) => parent.monthlyIncome ?? null,
  cpfBreakdown: (parent) => {
    if (!parent.age || !parent.monthlyIncome) {
      return null;
    }
    return calculateCPFContributions(parent.age, parent.monthlyIncome);
  },
};

const goalTypes: GqlResolvers["Goal"] = {
  id: (parent) => parent._id,
  planner: async (parent) => {
    const { planners } = await getPlannerCollections();
    const planner = await planners.findOne({ _id: parent.plannerId });
    if (!planner) throw new Error(`Planner not found: ${parent.plannerId}`);
    return planner;
  },
  monthlyAmount: (parent) => {
    if (parent.category === GoalCategory.MONTHLY) {
      return parent.amount;
    }
    // For time-bound goals, calculate monthly contribution
    return parent.duration ? parent.amount / parent.duration : parent.amount;
  },
  owner: async (parent) => {
    if (!parent.ownerUserId) return null;
    const { users } = await getUserCollections();
    const user = await users.findOne({ _id: parent.ownerUserId });
    return user ?? null;
  },
  duration: (parent) => parent.duration ?? null,
  startDate: (parent) => parent.startDate ?? null,
  endDate: (parent) => {
    if (!parent.startDate || !parent.duration) return null;
    // Parse YYYY-MM format and add duration months
    const [year, month] = parent.startDate.split("-").map(Number);
    const endMonth = month + parent.duration - 1;
    const endYear = year + Math.floor((endMonth - 1) / 12);
    const finalMonth = ((endMonth - 1) % 12) + 1;
    return `${endYear}-${String(finalMonth).padStart(2, "0")}`;
  },
  remarks: (parent) => parent.remarks ?? null,
  createdAt: (parent) => parent.createdAt.toISOString(),
  updatedAt: (parent) => parent.updatedAt.toISOString(),
};

// CustomRatio resolver - the userId is stored as string in Record<string, number>
// but needs to be returned as the scalar type
const customRatioTypes: GqlResolvers["CustomRatio"] = {
  userId: (parent) => parent.userId as unknown as import("mongodb").ObjectId,
  percentage: (parent) => parent.percentage,
};

export default {
  Planner: plannerTypes,
  PlannerMember: plannerMemberTypes,
  Goal: goalTypes,
  CustomRatio: customRatioTypes,
} satisfies Partial<GqlResolvers>;
