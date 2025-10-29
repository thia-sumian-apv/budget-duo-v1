import getUserCollections from "@/db/users/getCollections";
import { ObjectId } from "mongodb";
import { Role, type UserDocument } from "@/types";
import { toIso } from "@/lib/dayjs";
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
    updatePayload.role =
      (input.role as unknown) === ("ADMIN" as any) ||
      (input.role as unknown) === ("Admin" as any)
        ? Role.ADMIN
        : Role.USER;
  }

  const userResult = (await users.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatePayload },
    { returnDocument: "after" }
  )) as any;

  if (!userResult || !userResult.value) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "id", message: "User not found" }],
    };
  }

  const doc = userResult.value as UserDocument;
  return { __typename: "UpdateUserSuccessfulResponse", user: doc };
};

export default updateUser;
