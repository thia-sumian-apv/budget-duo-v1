import type { Collection } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { UserDocument } from "@/types/users/user";

export interface UserCollections {
  users: Collection<UserDocument>;
}

const getUserCollections = async (): Promise<UserCollections> => {
  const client = await clientPromise;
  const db = client.db();
  return {
    users: db.collection<UserDocument>("users"),
  };
};

export default getUserCollections;
