import getUserCollections from "@/db/users/getCollections";
import { ObjectId } from "mongodb";

const deleteUser = async (_: unknown, args: { id: string }) => {
  const { users } = await getUserCollections();
  const res = await users.deleteOne({ _id: new ObjectId(args.id) });
  return res.deletedCount === 1;
};

export default deleteUser;
