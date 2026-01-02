import type { GqlResolvers } from "@/graphql/__generated__/types";
import getPlannerCollections from "@/db/planners/getCollections";

const userTypes: GqlResolvers["User"] = {
  id: (parent) => parent._id,
  planners: async (parent) => {
    const { planners } = await getPlannerCollections();
    return planners.find({ "members.userId": parent._id }).toArray();
  },
};

export default { User: userTypes } satisfies Partial<GqlResolvers>;
