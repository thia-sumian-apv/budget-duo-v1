import { ObjectId } from "mongodb";
import getUserCollections from "@/db/users/getCollections";
import type { GqlQueryResolvers } from "@/graphql/__generated__/types";

const getUser: GqlQueryResolvers["getUser"] = async (_, { id }) => {
  const { users } = await getUserCollections();
  const userResult = await users.findOne({ _id: new ObjectId(id) });

  if (!userResult) {
    return null;
  }

  return userResult;
};

export default getUser;
