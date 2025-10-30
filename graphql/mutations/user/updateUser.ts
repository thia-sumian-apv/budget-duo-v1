import getUserCollections from "@/db/users/getCollections";
import { ObjectId } from "mongodb";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const updateUser: GqlMutationResolvers["updateUser"] = async (
  _,
  { id, input }
) => {
  const { users } = await getUserCollections();

  const updatePayload: Record<string, any> = { updatedAt: new Date() };
  if (typeof input.name !== "undefined") {
    updatePayload.name = input.name;
  }
  if (typeof input.image !== "undefined") {
    updatePayload.image = input.image;
  }
  if (typeof input.role !== "undefined" && input.role) {
    updatePayload.role = input.role;
  }

  const userResult = await users.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatePayload },
    { returnDocument: "after" }
  );

  if (!userResult) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "id", message: "User not found" }],
    };
  }

  return { __typename: "UpdateUserSuccessfulResponse", user: userResult };
};

export default updateUser;
