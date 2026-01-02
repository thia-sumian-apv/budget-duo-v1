import createUser from "./user/createUser";
import updateUser from "./user/updateUser";
import deleteUser from "./user/deleteUser";
import updateProfile from "./user/updateProfile";
import createPlanner from "./planner/createPlanner";
import joinPlanner from "./planner/joinPlanner";
import leavePlanner from "./planner/leavePlanner";
import updateMemberData from "./planner/updateMemberData";
import deletePlanner from "./planner/deletePlanner";
import createGoal from "./planner/createGoal";
import updateGoal from "./planner/updateGoal";
import deleteGoal from "./planner/deleteGoal";
import updateRatioSettings from "./planner/updateRatioSettings";

const Mutation = {
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  createPlanner,
  joinPlanner,
  leavePlanner,
  updateMemberData,
  deletePlanner,
  createGoal,
  updateGoal,
  deleteGoal,
  updateRatioSettings,
} as const;

export default Mutation;
