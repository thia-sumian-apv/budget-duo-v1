import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import type { GqlQueryResolvers } from "@/graphql/__generated__/types";

const getPlanner: GqlQueryResolvers["getPlanner"] = async (
  _,
  { id },
  { session }
) => {
  if (!session?.user?.id) {
    return null;
  }

  const { planners } = await getPlannerCollections();
  const planner = await planners.findOne({ _id: new ObjectId(id) });

  if (!planner) {
    return null;
  }

  // Check if user is a member
  const isMember = planner.members.some(
    (m) => m.userId.toString() === session.user.id
  );

  return isMember ? planner : null;
};

export default getPlanner;
