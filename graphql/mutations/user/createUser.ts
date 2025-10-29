import { Role, type UserDocument } from "@/types";
import getUserCollections from "@/db/users/getCollections";
import { ObjectId } from "mongodb";
import type { GqlMutationResolvers } from "@/graphql/__generated__/types";

const createUser: GqlMutationResolvers["createUser"] = async (_, { input }) => {
  const { email, name, image, role } = input;
  const { users } = await getUserCollections();
  const existing = await users.findOne({ email });

  if (existing) {
    return {
      __typename: "ErrorResponse",
      fields: [{ field: "email", message: "Email already exists" }],
    };
  }

  const now = new Date();
  const finalRole: Role = input.role ?? Role.USER;

  const doc: UserDocument = {
    _id: new ObjectId(),
    email,
    name: name ?? null,
    image: image ?? null,
    role: finalRole,
    createdAt: now,
    updatedAt: now,
  };

  await users.insertOne(doc);
  return { __typename: "CreateUserSuccessfulResponse", user: doc };
};

export default createUser;
