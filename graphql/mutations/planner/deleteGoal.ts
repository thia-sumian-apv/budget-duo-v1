import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import getGoalCollections from "@/db/planners/goalCollections";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const deleteGoal: GqlMutationResolvers["deleteGoal"] = async (
  _,
  { id },
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

  await goals.deleteOne({ _id: goalId });

  return {
    __typename: "DeleteGoalSuccessfulResponse",
    success: true,
    deletedId: goalId,
  };
};

export default deleteGoal;
