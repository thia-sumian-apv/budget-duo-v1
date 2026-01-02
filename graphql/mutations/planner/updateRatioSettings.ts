import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import { RatioMode } from "@/types";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const updateRatioSettings: GqlMutationResolvers["updateRatioSettings"] = async (
  _,
  { plannerId, input },
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
  const plannerOid = new ObjectId(plannerId);

  // Verify user is a member of the planner
  const planner = await planners.findOne({
    _id: plannerOid,
    "members.userId": userId,
  });

  if (!planner) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "plannerId", message: "Planner not found or not a member" }],
    };
  }

  // Validate custom ratios if mode is CUSTOM
  let customRatios: Record<string, number> | null = null;
  if (input.ratioMode === RatioMode.CUSTOM) {
    if (!input.customRatios || input.customRatios.length === 0) {
      return {
        __typename: "ErrorResponse",
        fields: [{ field: "customRatios", message: "Custom ratios are required for custom mode" }],
      };
    }

    // Validate that ratios sum to 100
    const totalPercentage = input.customRatios.reduce(
      (sum, r) => sum + r.percentage,
      0
    );
    if (totalPercentage !== 100) {
      return {
        __typename: "ErrorResponse",
        fields: [{ field: "customRatios", message: "Custom ratios must sum to 100%" }],
      };
    }

    // Validate that all member IDs are valid
    const memberIds = new Set(
      planner.members.map((m) => m.userId.toString())
    );
    for (const ratio of input.customRatios) {
      if (!memberIds.has(ratio.userId.toString())) {
        return {
          __typename: "ErrorResponse",
          fields: [{ field: "customRatios", message: `User ${ratio.userId} is not a member` }],
        };
      }
    }

    // Convert to record format
    customRatios = {};
    for (const ratio of input.customRatios) {
      customRatios[ratio.userId.toString()] = ratio.percentage;
    }
  }

  const result = await planners.findOneAndUpdate(
    { _id: plannerOid },
    {
      $set: {
        ratioMode: input.ratioMode as RatioMode,
        customRatios,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "plannerId", message: "Failed to update ratio settings" }],
    };
  }

  return { __typename: "UpdateRatioSettingsSuccessfulResponse", planner: result };
};

export default updateRatioSettings;
