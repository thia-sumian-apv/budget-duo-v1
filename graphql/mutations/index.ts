import createUser from "./user/createUser";
import updateUser from "./user/updateUser";
import deleteUser from "./user/deleteUser";

const Mutation = {
  createUser,
  updateUser,
  deleteUser,
} as const;

export default Mutation;
