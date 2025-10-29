import type { GqlResolvers } from "@/graphql/__generated__/types";
import { toIso } from "@/lib/dayjs";

const userTypes: GqlResolvers["User"] = {
  id: (parent) => parent._id,
};

export default { User: userTypes } satisfies Partial<GqlResolvers>;
