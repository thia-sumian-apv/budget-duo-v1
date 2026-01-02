import getUser from "./user/getUser";
import me from "./user/me";
import getPlanner from "./planner/getPlanner";
import myPlanners from "./planner/myPlanners";
import getPlannerByCode from "./planner/getPlannerByCode";

const Query = {
  getUser,
  me,
  getPlanner,
  myPlanners,
  getPlannerByCode,
};

export default Query;
