import { ObjectId } from "mongodb";
import getPlannerCollections from "@/db/planners/getCollections";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const updateMemberData: GqlMutationResolvers["updateMemberData"] = async (
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
  const planner = await planners.findOne({ _id: new ObjectId(plannerId) });

  if (!planner) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "plannerId", message: "Planner not found" }],
    };
  }

  // Find member index
  const memberIndex = planner.members.findIndex(
    (m) => m.userId.toString() === session.user.id
  );

  if (memberIndex === -1) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "plannerId", message: "Not a member of this planner" }],
    };
  }

  // Validate input
  if (input.age !== undefined && input.age !== null) {
    if (input.age < 0 || input.age > 150) {
      return {
        __typename: "ErrorResponse",
        fields: [{ field: "age", message: "Age must be between 0 and 150" }],
      };
    }
  }

  if (input.monthlyIncome !== undefined && input.monthlyIncome !== null) {
    if (input.monthlyIncome < 0) {
      return {
        __typename: "ErrorResponse",
        fields: [
          { field: "monthlyIncome", message: "Monthly income cannot be negative" },
        ],
      };
    }
  }

  // Build update object
  const updateObj: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (input.displayName !== undefined) {
    updateObj[`members.${memberIndex}.displayName`] = input.displayName;
  }
  if (input.age !== undefined) {
    updateObj[`members.${memberIndex}.age`] = input.age;
  }
  if (input.monthlyIncome !== undefined) {
    updateObj[`members.${memberIndex}.monthlyIncome`] = input.monthlyIncome;
  }

  const updatedPlanner = await planners.findOneAndUpdate(
    { _id: planner._id },
    { $set: updateObj },
    { returnDocument: "after" }
  );

  return {
    __typename: "UpdateMemberDataSuccessfulResponse",
    planner: updatedPlanner!,
  };
};

export default updateMemberData;
