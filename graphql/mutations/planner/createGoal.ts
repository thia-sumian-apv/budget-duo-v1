import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import getGoalCollections from "@/db/planners/goalCollections";
import {
  GoalCategory,
  GoalOwnerType,
  GoalFlowType,
  type GoalDocument,
} from "@/types";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const createGoal: GqlMutationResolvers["createGoal"] = async (
  _,
  { input },
  { session }
) => {
  if (!session?.user?.id) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "auth", message: "Must be authenticated" }],
    };
  }

  const { planners } = await getPlannerCollections();
  const { goals } = await getGoalCollections();
  const userId = new ObjectId(session.user.id);
  const plannerId = new ObjectId(input.plannerId);

  // Verify user is a member of the planner
  const planner = await planners.findOne({
    _id: plannerId,
    "members.userId": userId,
  });

  if (!planner) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "plannerId", message: "Planner not found or not a member" }],
    };
  }

  // Validate duration is provided for GOAL category
  if (input.category === GoalCategory.GOAL && !input.duration) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "duration", message: "Duration is required for time-bound goals" }],
    };
  }

  // Determine owner user ID based on owner type
  let ownerUserId: ObjectId | null = null;
  if (input.ownerType === GoalOwnerType.USER) {
    ownerUserId = userId;
  } else if (input.ownerType === GoalOwnerType.PARTNER) {
    // Find the other member in the planner
    const partner = planner.members.find(
      (m) => m.userId.toString() !== userId.toString()
    );
    if (!partner) {
      return {
        __typename: "ErrorResponse",
        fields: [{ field: "ownerType", message: "No partner found in planner" }],
      };
    }
    ownerUserId = partner.userId;
  }

  const now = new Date();
  const doc: GoalDocument = {
    _id: new ObjectId(),
    plannerId,
    name: input.name,
    amount: input.amount,
    category: input.category as GoalCategory,
    duration: input.category === GoalCategory.GOAL ? input.duration : null,
    startDate: input.category === GoalCategory.GOAL ? (input.startDate ?? null) : null,
    ownerType: input.ownerType as GoalOwnerType,
    ownerUserId,
    flowType: input.flowType as GoalFlowType,
    isCpfEligible: input.isCpfEligible,
    remarks: input.remarks ?? null,
    createdAt: now,
    updatedAt: now,
  };

  await goals.insertOne(doc);
  return { __typename: "CreateGoalSuccessfulResponse", goal: doc };
};

export default createGoal;
