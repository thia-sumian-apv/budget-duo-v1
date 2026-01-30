import { mergeTypeDefs } from "@graphql-tools/merge";

// Explicitly import all schema files (works reliably in serverless environments)
// Core schema definitions
import scalar from "./scalar.graphql";
import query from "./query.graphql";
import mutation from "./mutation.graphql";
import subscription from "./subscription.graphql";

// Error types
import errorResponse from "./error/ErrorResponse.graphql";
import errorOnField from "./error/ErrorOnField.graphql";

// User types
import user from "./user/types/User.graphql";
import createUserPayload from "./user/types/CreateUserPayload.graphql";
import updateUserPayload from "./user/types/UpdateUserPayload.graphql";
import updateProfilePayload from "./user/types/UpdateProfilePayload.graphql";
import role from "./user/enums/Role.graphql";
import createUserInput from "./user/inputs/CreateUserInput.graphql";
import updateUserInput from "./user/inputs/UpdateUserInput.graphql";
import updateProfileInput from "./user/inputs/UpdateProfileInput.graphql";

// Planner enums
import goalCategory from "./planner/enums/GoalCategory.graphql";
import goalFlowType from "./planner/enums/GoalFlowType.graphql";
import goalOwnerType from "./planner/enums/GoalOwnerType.graphql";
import plannerMemberRole from "./planner/enums/PlannerMemberRole.graphql";
import ratioMode from "./planner/enums/RatioMode.graphql";

// Planner inputs
import createGoalInput from "./planner/inputs/CreateGoalInput.graphql";
import createPlannerInput from "./planner/inputs/CreatePlannerInput.graphql";
import joinPlannerInput from "./planner/inputs/JoinPlannerInput.graphql";
import ratioSettingsInput from "./planner/inputs/RatioSettingsInput.graphql";
import updateGoalInput from "./planner/inputs/UpdateGoalInput.graphql";
import updateMemberDataInput from "./planner/inputs/UpdateMemberDataInput.graphql";

// Planner types
import cpfBreakdown from "./planner/types/CPFBreakdown.graphql";
import createPlannerPayload from "./planner/types/CreatePlannerPayload.graphql";
import goal from "./planner/types/Goal.graphql";
import goalPayloads from "./planner/types/GoalPayloads.graphql";
import joinPlannerPayload from "./planner/types/JoinPlannerPayload.graphql";
import leavePlannerPayload from "./planner/types/LeavePlannerPayload.graphql";
import planner from "./planner/types/Planner.graphql";
import plannerMember from "./planner/types/PlannerMember.graphql";
import updateMemberDataPayload from "./planner/types/UpdateMemberDataPayload.graphql";

const typeDefs = mergeTypeDefs([
  scalar,
  query,
  mutation,
  subscription,
  errorResponse,
  errorOnField,
  user,
  createUserPayload,
  updateUserPayload,
  updateProfilePayload,
  role,
  createUserInput,
  updateUserInput,
  updateProfileInput,
  goalCategory,
  goalFlowType,
  goalOwnerType,
  plannerMemberRole,
  ratioMode,
  createGoalInput,
  createPlannerInput,
  joinPlannerInput,
  ratioSettingsInput,
  updateGoalInput,
  updateMemberDataInput,
  cpfBreakdown,
  createPlannerPayload,
  goal,
  goalPayloads,
  joinPlannerPayload,
  leavePlannerPayload,
  planner,
  plannerMember,
  updateMemberDataPayload,
]);

export default typeDefs;
