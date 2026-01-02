import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import getGoalCollections from "@/db/planners/goalCollections";
import { GoalCategory, GoalOwnerType } from "@/types";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const updateGoal: GqlMutationResolvers["updateGoal"] = async (
  _,
  { id, input },
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
  const goalId = new ObjectId(id);

  // Find the goal
  const goal = await goals.findOne({ _id: goalId });
  if (!goal) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "id", message: "Goal not found" }],
    };
  }

  // Verify user is a member of the planner
  const planner = await planners.findOne({
    _id: goal.plannerId,
    "members.userId": userId,
  });

  if (!planner) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "plannerId", message: "Not a member of this planner" }],
    };
  }

  // Build update object
  const updateFields: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined && input.name !== null) {
    updateFields.name = input.name;
  }
  if (input.amount !== undefined && input.amount !== null) {
    updateFields.amount = input.amount;
  }
  if (input.category !== undefined && input.category !== null) {
    updateFields.category = input.category;
  }
  if (input.duration !== undefined) {
    updateFields.duration = input.duration;
  }
  if (input.startDate !== undefined) {
    updateFields.startDate = input.startDate;
  }
  if (input.flowType !== undefined && input.flowType !== null) {
    updateFields.flowType = input.flowType;
  }
  if (input.isCpfEligible !== undefined && input.isCpfEligible !== null) {
    updateFields.isCpfEligible = input.isCpfEligible;
  }
  if (input.remarks !== undefined) {
    updateFields.remarks = input.remarks;
  }

  // Handle owner type change
  if (input.ownerType !== undefined && input.ownerType !== null) {
    updateFields.ownerType = input.ownerType;
    if (input.ownerType === GoalOwnerType.USER) {
      updateFields.ownerUserId = userId;
    } else if (input.ownerType === GoalOwnerType.PARTNER) {
      const partner = planner.members.find(
        (m) => m.userId.toString() !== userId.toString()
      );
      if (!partner) {
        return {
          __typename: "ErrorResponse",
          fields: [{ field: "ownerType", message: "No partner found in planner" }],
        };
      }
      updateFields.ownerUserId = partner.userId;
    } else {
      updateFields.ownerUserId = null;
    }
  }

  // Validate duration for GOAL category
  const finalCategory = (updateFields.category as GoalCategory) ?? goal.category;
  if (finalCategory === GoalCategory.GOAL) {
    const finalDuration = updateFields.duration ?? goal.duration;
    if (!finalDuration) {
      return {
        __typename: "ErrorResponse",
        fields: [{ field: "duration", message: "Duration is required for time-bound goals" }],
      };
    }
  }

  const result = await goals.findOneAndUpdate(
    { _id: goalId },
    { $set: updateFields },
    { returnDocument: "after" }
  );

  if (!result) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "id", message: "Failed to update goal" }],
    };
  }

  return { __typename: "UpdateGoalSuccessfulResponse", goal: result };
};

export default updateGoal;
