import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import { PlannerMemberRole } from "@/types";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const deletePlanner: GqlMutationResolvers["deletePlanner"] = async (
  _,
  { id },
  { session }
) => {
  if (!session?.user?.id) {
    return false;
  }

  const { planners } = await getPlannerCollections();
  const planner = await planners.findOne({ _id: new ObjectId(id) });

  if (!planner) {
    return false;
  }

  // Only owner can delete
  const member = planner.members.find(
    (m) => m.userId.toString() === session.user.id
  );

  if (!member || member.role !== PlannerMemberRole.OWNER) {
    return false;
  }

  const result = await planners.deleteOne({ _id: planner._id });
  return result.deletedCount === 1;
};

export default deletePlanner;
