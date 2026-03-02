import { ObjectId } from "mongodb";
import getUserCollections from "@/db/users/getCollections";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const updateProfile: GqlMutationResolvers["updateProfile"] = async (
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

  const { users } = await getUserCollections();
  const updatePayload: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof input.displayName !== "undefined") {
    updatePayload.displayName = input.displayName;
  }

  const userResult = await users.findOneAndUpdate(
    { _id: new ObjectId(session.user.id) },
    { $set: updatePayload },
    { returnDocument: "after" }
  );

  if (!userResult) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "id", message: "User not found" }],
    };
  }

  const { password: _pw, ...safeUser } = userResult as any;
  return { __typename: "UpdateProfileSuccessfulResponse", user: safeUser };
};

export default updateProfile;
