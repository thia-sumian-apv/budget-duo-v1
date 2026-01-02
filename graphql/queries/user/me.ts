import { ObjectId } from "mongodb";
import getUserCollections from "@/db/users/getCollections";
import type { GqlQueryResolvers } from "@/graphql/__generated__/types";

const me: GqlQueryResolvers["me"] = async (_, __, { session }) => {
  if (!session?.user?.id) {
    return null;
  }

  const { users } = await getUserCollections();
  return users.findOne({ _id: new ObjectId(session.user.id) });
};

export default me;
