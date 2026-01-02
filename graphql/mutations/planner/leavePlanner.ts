import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import { PlannerMemberRole } from "@/types";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const leavePlanner: GqlMutationResolvers["leavePlanner"] = async (
  _,
  { plannerId },
  { session }
) => {
  if (!session?.user?.id) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "auth", message: "Must be authenticated" }],
    };
  }

  const { planners } = await getPlannerCollections();
  const planner = await planners.findOne({ _id: new ObjectId(plannerId) });

  if (!planner) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "plannerId", message: "Planner not found" }],
    };
  }

  const member = planner.members.find(
    (m) => m.userId.toString() === session.user.id
  );

  if (!member) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "plannerId", message: "Not a member of this planner" }],
    };
  }

  if (member.role === PlannerMemberRole.OWNER) {
    return {
      __typename: "ErrorResponse",
      fields: [
        {
          field: "plannerId",
          message: "Owner cannot leave. Transfer ownership or delete the planner.",
        },
      ],
    };
  }

  await planners.updateOne(
    { _id: planner._id },
    {
      $pull: { members: { userId: new ObjectId(session.user.id) } },
      $set: { updatedAt: new Date() },
    }
  );

  return { __typename: "LeavePlannerSuccessfulResponse", success: true };
};

export default leavePlanner;
