import userTypes from "./user";
import plannerTypes from "./planner";
import ObjectID from "./scalars/ObjectID";

const types = {
  ...userTypes,
  ...plannerTypes,
  ObjectID,
};

export default types;
