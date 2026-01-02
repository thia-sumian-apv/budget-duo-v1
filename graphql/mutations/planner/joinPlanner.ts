import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import { PlannerMemberRole } from "@/types";
import { normalizePlannerCode } from "@/lib/utils/plannerCode";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const joinPlanner: GqlMutationResolvers["joinPlanner"] = async (
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
  const userId = new ObjectId(session.user.id);
  const code = normalizePlannerCode(input.code);

  if (code.length !== 6) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "code", message: "Invalid code format" }],
    };
  }

  const planner = await planners.findOne({ code });
  if (!planner) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "code", message: "Invalid planner code" }],
    };
  }

  // Check if already a member
  const isAlreadyMember = planner.members.some(
    (m) => m.userId.toString() === session.user.id
  );
  if (isAlreadyMember) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "code", message: "Already a member of this planner" }],
    };
  }

  const now = new Date();
  const updatedPlanner = await planners.findOneAndUpdate(
    { _id: planner._id },
    {
      $push: {
        members: {
          userId,
          joinedAt: now,
          role: PlannerMemberRole.MEMBER,
        },
      },
      $set: { updatedAt: now },
    },
    { returnDocument: "after" }
  );

  return {
    __typename: "JoinPlannerSuccessfulResponse",
    planner: updatedPlanner!,
  };
};

export default joinPlanner;
