import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import { PlannerMemberRole, RatioMode, type PlannerDocument } from "@/types";
import { generatePlannerCode } from "@/lib/utils/plannerCode";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const createPlanner: GqlMutationResolvers["createPlanner"] = async (
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
  const now = new Date();

  // Generate unique code with retry
  let code: string;
  let attempts = 0;
  do {
    code = generatePlannerCode();
    const existing = await planners.findOne({ code });
    if (!existing) break;
    attempts++;
  } while (attempts < 10);

  if (attempts >= 10) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "code", message: "Failed to generate unique code" }],
    };
  }

  const doc: PlannerDocument = {
    _id: new ObjectId(),
    name: input.name,
    code,
    members: [
      {
        userId,
        joinedAt: now,
        role: PlannerMemberRole.OWNER,
      },
    ],
    ratioMode: RatioMode.INCOME_BASED,
    createdBy: userId,
    createdAt: now,
    updatedAt: now,
  };

  await planners.insertOne(doc);
  return { __typename: "CreatePlannerSuccessfulResponse", planner: doc };
};

export default createPlanner;
