import userTypes from "./user";
import plannerTypes from "./planner";
import ObjectID from "./scalars/ObjectID";

export default {
  ...userTypes,
  ...plannerTypes,
  ObjectID,
};
