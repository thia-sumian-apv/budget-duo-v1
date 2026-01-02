import getPlannerCollections from "@/db/planners/getCollections";
import { normalizePlannerCode } from "@/lib/utils/plannerCode";
import type { GqlQueryResolvers } from "@/graphql/__generated__/types";

const getPlannerByCode: GqlQueryResolvers["getPlannerByCode"] = async (
  _,
  { code }
) => {
  const { planners } = await getPlannerCollections();
  const normalizedCode = normalizePlannerCode(code);
  return planners.findOne({ code: normalizedCode });
};

export default getPlannerByCode;
