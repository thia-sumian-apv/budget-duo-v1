import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import type { GqlQueryResolvers } from "@/graphql/__generated__/types";

const myPlanners: GqlQueryResolvers["myPlanners"] = async (
  _,
  __,
  { session }
) => {
  if (!session?.user?.id) return [];

  const { planners } = await getPlannerCollections();
  const userPlanners = await planners
    .find({ "members.userId": new ObjectId(session.user.id) })
    .toArray();

  return userPlanners;
};

export default myPlanners;
