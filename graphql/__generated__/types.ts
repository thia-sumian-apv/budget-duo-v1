import { Role } from "@/types";
import { PlannerMemberRole } from "@/types";
import { RatioMode } from "@/types";
import { GoalCategory } from "@/types";
import { GoalOwnerType } from "@/types";
import { GoalFlowType } from "@/types";
import { ObjectId } from "mongodb";
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { UserDocument, PlannerDocument, GoalDocument } from "@/types";
import { PlannerMember } from "@/types/planners/planner";
import { GraphQLContext } from "@/graphql/resolvers";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = {
  [key in keyof T]?: AllowedValues;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /**
   * DateTime
   *
   * GraphQL DateTime-Type for Dates
   */
  DateTime: { input: string; output: string };
  /**
   * ObjectID
   *
   * GraphQL ID-Type for MongoDB ID
   */
  ObjectID: { input: ObjectId; output: ObjectId };
};

/**
 * Computed CPF (Central Provident Fund) contributions based on age and income.
 * Used for Singapore CPF-aware budget planning.
 */
export type GqlCpfBreakdown = {
  __typename?: "CPFBreakdown";
  /** Amount deducted from employee's salary */
  employeeContribution: Scalars["Float"]["output"];
  /** Employer's CPF contribution */
  employerContribution: Scalars["Float"]["output"];
  /** Medisave Account - for healthcare */
  medisaveAccount: Scalars["Float"]["output"];
  /** Ordinary Account - for housing, education, investment */
  ordinaryAccount: Scalars["Float"]["output"];
  /** Special Account - for retirement */
  specialAccount: Scalars["Float"]["output"];
  /** Net salary after CPF deduction */
  takeHomePay: Scalars["Float"]["output"];
  /** Total CPF contribution (employee + employer) */
  totalContribution: Scalars["Float"]["output"];
};

/** Input for creating a new goal within a planner. */
export type GqlCreateGoalInput = {
  /** Total amount (or monthly if category=MONTHLY) */
  amount: Scalars["Float"]["input"];
  category: GoalCategory;
  /** Number of months (required if category=GOAL) */
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  flowType: GoalFlowType;
  /** User toggle: deduct from CPF OA if true */
  isCpfEligible: Scalars["Boolean"]["input"];
  name: Scalars["String"]["input"];
  ownerType: GoalOwnerType;
  plannerId: Scalars["ObjectID"]["input"];
  remarks?: InputMaybe<Scalars["String"]["input"]>;
  /** Start month for time-bound goals (YYYY-MM format) */
  startDate?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlCreateGoalResponse =
  | GqlCreateGoalSuccessfulResponse
  | GqlErrorResponse;

export type GqlCreateGoalSuccessfulResponse = {
  __typename?: "CreateGoalSuccessfulResponse";
  goal: GqlGoal;
};

export type GqlCreatePlannerInput = {
  name: Scalars["String"]["input"];
};

export type GqlCreatePlannerResponse =
  | GqlCreatePlannerSuccessfulResponse
  | GqlErrorResponse;

export type GqlCreatePlannerSuccessfulResponse = {
  __typename?: "CreatePlannerSuccessfulResponse";
  planner: GqlPlanner;
};

export type GqlCreateUserInput = {
  email: Scalars["String"]["input"];
  image?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Role>;
};

export type GqlCreateUserResponse =
  | GqlCreateUserSuccessfulResponse
  | GqlErrorResponse;

export type GqlCreateUserSuccessfulResponse = {
  __typename?: "CreateUserSuccessfulResponse";
  user: GqlUser;
};

/** A custom ratio entry mapping a user to their contribution percentage. */
export type GqlCustomRatio = {
  __typename?: "CustomRatio";
  percentage: Scalars["Int"]["output"];
  userId: Scalars["ObjectID"]["output"];
};

/** Input for a custom ratio entry. */
export type GqlCustomRatioInput = {
  /** Percentage (0-100) */
  percentage: Scalars["Int"]["input"];
  userId: Scalars["ObjectID"]["input"];
};

export type GqlDeleteGoalResponse =
  | GqlDeleteGoalSuccessfulResponse
  | GqlErrorResponse;

export type GqlDeleteGoalSuccessfulResponse = {
  __typename?: "DeleteGoalSuccessfulResponse";
  deletedId: Scalars["ObjectID"]["output"];
  success: Scalars["Boolean"]["output"];
};

export type GqlErrorOnField = {
  __typename?: "ErrorOnField";
  field: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
};

export type GqlErrorResponse = {
  __typename?: "ErrorResponse";
  fields?: Maybe<Array<GqlErrorOnField>>;
};

/**
 * A financial goal or expense within a planner.
 * Goals can be monthly expenses or time-bound savings goals.
 */
export type GqlGoal = {
  __typename?: "Goal";
  /** Total amount (or monthly if category=MONTHLY) */
  amount: Scalars["Float"]["output"];
  category: GoalCategory;
  createdAt: Scalars["String"]["output"];
  /** Number of months (if category=GOAL) */
  duration?: Maybe<Scalars["Int"]["output"]>;
  /** End month calculated from startDate + duration (YYYY-MM format) */
  endDate?: Maybe<Scalars["String"]["output"]>;
  flowType: GoalFlowType;
  id: Scalars["ObjectID"]["output"];
  /** User toggle: deduct from CPF OA if true */
  isCpfEligible: Scalars["Boolean"]["output"];
  /** Monthly contribution (calculated: amount/duration for GOAL, amount for MONTHLY) */
  monthlyAmount: Scalars["Float"]["output"];
  name: Scalars["String"]["output"];
  /** User who owns this goal (for USER/PARTNER types) */
  owner?: Maybe<GqlUser>;
  ownerType: GoalOwnerType;
  planner: GqlPlanner;
  remarks?: Maybe<Scalars["String"]["output"]>;
  /** Start month for time-bound goals (YYYY-MM format) */
  startDate?: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["String"]["output"];
};

export { GoalCategory };

export { GoalFlowType };

export { GoalOwnerType };

export type GqlJoinPlannerInput = {
  /** The 6-character planner code (case-insensitive) */
  code: Scalars["String"]["input"];
};

export type GqlJoinPlannerResponse =
  | GqlErrorResponse
  | GqlJoinPlannerSuccessfulResponse;

export type GqlJoinPlannerSuccessfulResponse = {
  __typename?: "JoinPlannerSuccessfulResponse";
  planner: GqlPlanner;
};

export type GqlLeavePlannerResponse =
  | GqlErrorResponse
  | GqlLeavePlannerSuccessfulResponse;

export type GqlLeavePlannerSuccessfulResponse = {
  __typename?: "LeavePlannerSuccessfulResponse";
  success: Scalars["Boolean"]["output"];
};

export type GqlMutation = {
  __typename?: "Mutation";
  /** Create a new goal in a planner */
  createGoal: GqlCreateGoalResponse;
  /** Create a new planner (current user becomes owner) */
  createPlanner: GqlCreatePlannerResponse;
  createUser: GqlCreateUserResponse;
  /** Delete a goal */
  deleteGoal: GqlDeleteGoalResponse;
  /** Delete a planner (owner only) */
  deletePlanner: Scalars["Boolean"]["output"];
  deleteUser: Scalars["Boolean"]["output"];
  /** Join an existing planner by code */
  joinPlanner: GqlJoinPlannerResponse;
  /** Leave a planner (owner cannot leave, must transfer or delete) */
  leavePlanner: GqlLeavePlannerResponse;
  /** Update an existing goal */
  updateGoal: GqlUpdateGoalResponse;
  /** Update member's financial data in a planner (age, income) */
  updateMemberData: GqlUpdateMemberDataResponse;
  /** Update the current user's profile (displayName) */
  updateProfile: GqlUpdateProfileResponse;
  /** Update the ratio settings for a planner */
  updateRatioSettings: GqlUpdateRatioSettingsResponse;
  updateUser: GqlUpdateUserResponse;
};

export type GqlMutationCreateGoalArgs = {
  input: GqlCreateGoalInput;
};

export type GqlMutationCreatePlannerArgs = {
  input: GqlCreatePlannerInput;
};

export type GqlMutationCreateUserArgs = {
  input: GqlCreateUserInput;
};

export type GqlMutationDeleteGoalArgs = {
  id: Scalars["ObjectID"]["input"];
};

export type GqlMutationDeletePlannerArgs = {
  id: Scalars["ObjectID"]["input"];
};

export type GqlMutationDeleteUserArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlMutationJoinPlannerArgs = {
  input: GqlJoinPlannerInput;
};

export type GqlMutationLeavePlannerArgs = {
  plannerId: Scalars["ObjectID"]["input"];
};

export type GqlMutationUpdateGoalArgs = {
  id: Scalars["ObjectID"]["input"];
  input: GqlUpdateGoalInput;
};

export type GqlMutationUpdateMemberDataArgs = {
  input: GqlUpdateMemberDataInput;
  plannerId: Scalars["ObjectID"]["input"];
};

export type GqlMutationUpdateProfileArgs = {
  input: GqlUpdateProfileInput;
};

export type GqlMutationUpdateRatioSettingsArgs = {
  input: GqlRatioSettingsInput;
  plannerId: Scalars["ObjectID"]["input"];
};

export type GqlMutationUpdateUserArgs = {
  id: Scalars["ID"]["input"];
  input: GqlUpdateUserInput;
};

/**
 * A planner that can be shared between multiple users (typically a couple).
 * Each planner has a unique code for sharing and stores per-member financial data.
 */
export type GqlPlanner = {
  __typename?: "Planner";
  code: Scalars["String"]["output"];
  createdAt: Scalars["String"]["output"];
  createdBy: GqlUser;
  /** Custom ratios per user (percentages 0-100). Keys are user IDs. */
  customRatios?: Maybe<Array<GqlCustomRatio>>;
  goals: Array<GqlGoal>;
  id: Scalars["ObjectID"]["output"];
  members: Array<GqlPlannerMember>;
  name: Scalars["String"]["output"];
  ratioMode: RatioMode;
  updatedAt: Scalars["String"]["output"];
};

/**
 * A member of a planner with their role, join date, and financial data.
 * Financial data (age, income) is per-planner, allowing users to have
 * different settings across multiple planners.
 */
export type GqlPlannerMember = {
  __typename?: "PlannerMember";
  age?: Maybe<Scalars["Int"]["output"]>;
  cpfBreakdown?: Maybe<GqlCpfBreakdown>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  joinedAt: Scalars["String"]["output"];
  monthlyIncome?: Maybe<Scalars["Float"]["output"]>;
  role: PlannerMemberRole;
  user: GqlUser;
};

export { PlannerMemberRole };

export type GqlQuery = {
  __typename?: "Query";
  /** Get a planner by ID (must be a member) */
  getPlanner?: Maybe<GqlPlanner>;
  /** Look up a planner by code (for previewing before joining) */
  getPlannerByCode?: Maybe<GqlPlanner>;
  getUser?: Maybe<GqlUser>;
  /** Get the current authenticated user */
  me?: Maybe<GqlUser>;
  /** Get all planners for the current user */
  myPlanners: Array<GqlPlanner>;
};

export type GqlQueryGetPlannerArgs = {
  id: Scalars["ObjectID"]["input"];
};

export type GqlQueryGetPlannerByCodeArgs = {
  code: Scalars["String"]["input"];
};

export type GqlQueryGetUserArgs = {
  id: Scalars["ObjectID"]["input"];
};

export { RatioMode };

/** Input for updating ratio settings on a planner. */
export type GqlRatioSettingsInput = {
  /** Custom ratios per user. Only required if ratioMode=CUSTOM. Percentages must sum to 100. */
  customRatios?: InputMaybe<Array<GqlCustomRatioInput>>;
  ratioMode: RatioMode;
};

export { Role };

export type GqlSubscription = {
  __typename?: "Subscription";
  _noop?: Maybe<Scalars["Boolean"]["output"]>;
};

/** Input for updating an existing goal. */
export type GqlUpdateGoalInput = {
  amount?: InputMaybe<Scalars["Float"]["input"]>;
  category?: InputMaybe<GoalCategory>;
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  flowType?: InputMaybe<GoalFlowType>;
  isCpfEligible?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  ownerType?: InputMaybe<GoalOwnerType>;
  remarks?: InputMaybe<Scalars["String"]["input"]>;
  /** Start month for time-bound goals (YYYY-MM format) */
  startDate?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlUpdateGoalResponse =
  | GqlErrorResponse
  | GqlUpdateGoalSuccessfulResponse;

export type GqlUpdateGoalSuccessfulResponse = {
  __typename?: "UpdateGoalSuccessfulResponse";
  goal: GqlGoal;
};

/** Input for updating a member's financial data within a planner. */
export type GqlUpdateMemberDataInput = {
  age?: InputMaybe<Scalars["Int"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  monthlyIncome?: InputMaybe<Scalars["Float"]["input"]>;
};

export type GqlUpdateMemberDataResponse =
  | GqlErrorResponse
  | GqlUpdateMemberDataSuccessfulResponse;

export type GqlUpdateMemberDataSuccessfulResponse = {
  __typename?: "UpdateMemberDataSuccessfulResponse";
  planner: GqlPlanner;
};

/** Input for updating user profile (account-level settings). */
export type GqlUpdateProfileInput = {
  displayName?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlUpdateProfileResponse =
  | GqlErrorResponse
  | GqlUpdateProfileSuccessfulResponse;

export type GqlUpdateProfileSuccessfulResponse = {
  __typename?: "UpdateProfileSuccessfulResponse";
  user: GqlUser;
};

export type GqlUpdateRatioSettingsResponse =
  | GqlErrorResponse
  | GqlUpdateRatioSettingsSuccessfulResponse;

export type GqlUpdateRatioSettingsSuccessfulResponse = {
  __typename?: "UpdateRatioSettingsSuccessfulResponse";
  planner: GqlPlanner;
};

export type GqlUpdateUserInput = {
  image?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Role>;
};

export type GqlUpdateUserResponse =
  | GqlErrorResponse
  | GqlUpdateUserSuccessfulResponse;

export type GqlUpdateUserSuccessfulResponse = {
  __typename?: "UpdateUserSuccessfulResponse";
  user: GqlUser;
};

/** User object returned by authentication and used across the app. */
export type GqlUser = {
  __typename?: "User";
  createdAt?: Maybe<Scalars["String"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  id: Scalars["ObjectID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  planners: Array<GqlPlanner>;
  provider?: Maybe<Scalars["String"]["output"]>;
  providerAccountId?: Maybe<Scalars["String"]["output"]>;
  role: Role;
  updatedAt?: Maybe<Scalars["String"]["output"]>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<
  TTypes,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<
  T = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type GqlResolversUnionTypes<_RefType extends Record<string, unknown>> =
  ResolversObject<{
    CreateGoalResponse:
      | (Omit<GqlCreateGoalSuccessfulResponse, "goal"> & {
          goal: _RefType["Goal"];
        })
      | GqlErrorResponse;
    CreatePlannerResponse:
      | (Omit<GqlCreatePlannerSuccessfulResponse, "planner"> & {
          planner: _RefType["Planner"];
        })
      | GqlErrorResponse;
    CreateUserResponse:
      | (Omit<GqlCreateUserSuccessfulResponse, "user"> & {
          user: _RefType["User"];
        })
      | GqlErrorResponse;
    DeleteGoalResponse: GqlDeleteGoalSuccessfulResponse | GqlErrorResponse;
    JoinPlannerResponse:
      | GqlErrorResponse
      | (Omit<GqlJoinPlannerSuccessfulResponse, "planner"> & {
          planner: _RefType["Planner"];
        });
    LeavePlannerResponse: GqlErrorResponse | GqlLeavePlannerSuccessfulResponse;
    UpdateGoalResponse:
      | GqlErrorResponse
      | (Omit<GqlUpdateGoalSuccessfulResponse, "goal"> & {
          goal: _RefType["Goal"];
        });
    UpdateMemberDataResponse:
      | GqlErrorResponse
      | (Omit<GqlUpdateMemberDataSuccessfulResponse, "planner"> & {
          planner: _RefType["Planner"];
        });
    UpdateProfileResponse:
      | GqlErrorResponse
      | (Omit<GqlUpdateProfileSuccessfulResponse, "user"> & {
          user: _RefType["User"];
        });
    UpdateRatioSettingsResponse:
      | GqlErrorResponse
      | (Omit<GqlUpdateRatioSettingsSuccessfulResponse, "planner"> & {
          planner: _RefType["Planner"];
        });
    UpdateUserResponse:
      | GqlErrorResponse
      | (Omit<GqlUpdateUserSuccessfulResponse, "user"> & {
          user: _RefType["User"];
        });
  }>;

/** Mapping between all available schema types and the resolvers types */
export type GqlResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  CPFBreakdown: ResolverTypeWrapper<GqlCpfBreakdown>;
  CreateGoalInput: GqlCreateGoalInput;
  CreateGoalResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["CreateGoalResponse"]
  >;
  CreateGoalSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlCreateGoalSuccessfulResponse, "goal"> & {
      goal: GqlResolversTypes["Goal"];
    }
  >;
  CreatePlannerInput: GqlCreatePlannerInput;
  CreatePlannerResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["CreatePlannerResponse"]
  >;
  CreatePlannerSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlCreatePlannerSuccessfulResponse, "planner"> & {
      planner: GqlResolversTypes["Planner"];
    }
  >;
  CreateUserInput: GqlCreateUserInput;
  CreateUserResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["CreateUserResponse"]
  >;
  CreateUserSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlCreateUserSuccessfulResponse, "user"> & {
      user: GqlResolversTypes["User"];
    }
  >;
  CustomRatio: ResolverTypeWrapper<GqlCustomRatio>;
  CustomRatioInput: GqlCustomRatioInput;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]["output"]>;
  DeleteGoalResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["DeleteGoalResponse"]
  >;
  DeleteGoalSuccessfulResponse: ResolverTypeWrapper<GqlDeleteGoalSuccessfulResponse>;
  ErrorOnField: ResolverTypeWrapper<GqlErrorOnField>;
  ErrorResponse: ResolverTypeWrapper<GqlErrorResponse>;
  Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
  Goal: ResolverTypeWrapper<GoalDocument>;
  GoalCategory: GoalCategory;
  GoalFlowType: GoalFlowType;
  GoalOwnerType: GoalOwnerType;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  JoinPlannerInput: GqlJoinPlannerInput;
  JoinPlannerResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["JoinPlannerResponse"]
  >;
  JoinPlannerSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlJoinPlannerSuccessfulResponse, "planner"> & {
      planner: GqlResolversTypes["Planner"];
    }
  >;
  LeavePlannerResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["LeavePlannerResponse"]
  >;
  LeavePlannerSuccessfulResponse: ResolverTypeWrapper<GqlLeavePlannerSuccessfulResponse>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ObjectID: ResolverTypeWrapper<Scalars["ObjectID"]["output"]>;
  Planner: ResolverTypeWrapper<PlannerDocument>;
  PlannerMember: ResolverTypeWrapper<PlannerMember>;
  PlannerMemberRole: PlannerMemberRole;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RatioMode: RatioMode;
  RatioSettingsInput: GqlRatioSettingsInput;
  Role: Role;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  UpdateGoalInput: GqlUpdateGoalInput;
  UpdateGoalResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["UpdateGoalResponse"]
  >;
  UpdateGoalSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlUpdateGoalSuccessfulResponse, "goal"> & {
      goal: GqlResolversTypes["Goal"];
    }
  >;
  UpdateMemberDataInput: GqlUpdateMemberDataInput;
  UpdateMemberDataResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["UpdateMemberDataResponse"]
  >;
  UpdateMemberDataSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlUpdateMemberDataSuccessfulResponse, "planner"> & {
      planner: GqlResolversTypes["Planner"];
    }
  >;
  UpdateProfileInput: GqlUpdateProfileInput;
  UpdateProfileResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["UpdateProfileResponse"]
  >;
  UpdateProfileSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlUpdateProfileSuccessfulResponse, "user"> & {
      user: GqlResolversTypes["User"];
    }
  >;
  UpdateRatioSettingsResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["UpdateRatioSettingsResponse"]
  >;
  UpdateRatioSettingsSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlUpdateRatioSettingsSuccessfulResponse, "planner"> & {
      planner: GqlResolversTypes["Planner"];
    }
  >;
  UpdateUserInput: GqlUpdateUserInput;
  UpdateUserResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["UpdateUserResponse"]
  >;
  UpdateUserSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlUpdateUserSuccessfulResponse, "user"> & {
      user: GqlResolversTypes["User"];
    }
  >;
  User: ResolverTypeWrapper<UserDocument>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = ResolversObject<{
  Boolean: Scalars["Boolean"]["output"];
  CPFBreakdown: GqlCpfBreakdown;
  CreateGoalInput: GqlCreateGoalInput;
  CreateGoalResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["CreateGoalResponse"];
  CreateGoalSuccessfulResponse: Omit<
    GqlCreateGoalSuccessfulResponse,
    "goal"
  > & { goal: GqlResolversParentTypes["Goal"] };
  CreatePlannerInput: GqlCreatePlannerInput;
  CreatePlannerResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["CreatePlannerResponse"];
  CreatePlannerSuccessfulResponse: Omit<
    GqlCreatePlannerSuccessfulResponse,
    "planner"
  > & { planner: GqlResolversParentTypes["Planner"] };
  CreateUserInput: GqlCreateUserInput;
  CreateUserResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["CreateUserResponse"];
  CreateUserSuccessfulResponse: Omit<
    GqlCreateUserSuccessfulResponse,
    "user"
  > & { user: GqlResolversParentTypes["User"] };
  CustomRatio: GqlCustomRatio;
  CustomRatioInput: GqlCustomRatioInput;
  DateTime: Scalars["DateTime"]["output"];
  DeleteGoalResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["DeleteGoalResponse"];
  DeleteGoalSuccessfulResponse: GqlDeleteGoalSuccessfulResponse;
  ErrorOnField: GqlErrorOnField;
  ErrorResponse: GqlErrorResponse;
  Float: Scalars["Float"]["output"];
  Goal: GoalDocument;
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  JoinPlannerInput: GqlJoinPlannerInput;
  JoinPlannerResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["JoinPlannerResponse"];
  JoinPlannerSuccessfulResponse: Omit<
    GqlJoinPlannerSuccessfulResponse,
    "planner"
  > & { planner: GqlResolversParentTypes["Planner"] };
  LeavePlannerResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["LeavePlannerResponse"];
  LeavePlannerSuccessfulResponse: GqlLeavePlannerSuccessfulResponse;
  Mutation: Record<PropertyKey, never>;
  ObjectID: Scalars["ObjectID"]["output"];
  Planner: PlannerDocument;
  PlannerMember: PlannerMember;
  Query: Record<PropertyKey, never>;
  RatioSettingsInput: GqlRatioSettingsInput;
  String: Scalars["String"]["output"];
  Subscription: Record<PropertyKey, never>;
  UpdateGoalInput: GqlUpdateGoalInput;
  UpdateGoalResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["UpdateGoalResponse"];
  UpdateGoalSuccessfulResponse: Omit<
    GqlUpdateGoalSuccessfulResponse,
    "goal"
  > & { goal: GqlResolversParentTypes["Goal"] };
  UpdateMemberDataInput: GqlUpdateMemberDataInput;
  UpdateMemberDataResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["UpdateMemberDataResponse"];
  UpdateMemberDataSuccessfulResponse: Omit<
    GqlUpdateMemberDataSuccessfulResponse,
    "planner"
  > & { planner: GqlResolversParentTypes["Planner"] };
  UpdateProfileInput: GqlUpdateProfileInput;
  UpdateProfileResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["UpdateProfileResponse"];
  UpdateProfileSuccessfulResponse: Omit<
    GqlUpdateProfileSuccessfulResponse,
    "user"
  > & { user: GqlResolversParentTypes["User"] };
  UpdateRatioSettingsResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["UpdateRatioSettingsResponse"];
  UpdateRatioSettingsSuccessfulResponse: Omit<
    GqlUpdateRatioSettingsSuccessfulResponse,
    "planner"
  > & { planner: GqlResolversParentTypes["Planner"] };
  UpdateUserInput: GqlUpdateUserInput;
  UpdateUserResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["UpdateUserResponse"];
  UpdateUserSuccessfulResponse: Omit<
    GqlUpdateUserSuccessfulResponse,
    "user"
  > & { user: GqlResolversParentTypes["User"] };
  User: UserDocument;
}>;

export type GqlCpfBreakdownResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["CPFBreakdown"] = GqlResolversParentTypes["CPFBreakdown"],
> = ResolversObject<{
  employeeContribution?: Resolver<
    GqlResolversTypes["Float"],
    ParentType,
    ContextType
  >;
  employerContribution?: Resolver<
    GqlResolversTypes["Float"],
    ParentType,
    ContextType
  >;
  medisaveAccount?: Resolver<
    GqlResolversTypes["Float"],
    ParentType,
    ContextType
  >;
  ordinaryAccount?: Resolver<
    GqlResolversTypes["Float"],
    ParentType,
    ContextType
  >;
  specialAccount?: Resolver<
    GqlResolversTypes["Float"],
    ParentType,
    ContextType
  >;
  takeHomePay?: Resolver<GqlResolversTypes["Float"], ParentType, ContextType>;
  totalContribution?: Resolver<
    GqlResolversTypes["Float"],
    ParentType,
    ContextType
  >;
}>;

export type GqlCreateGoalResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["CreateGoalResponse"] = GqlResolversParentTypes["CreateGoalResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "CreateGoalSuccessfulResponse" | "ErrorResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlCreateGoalSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["CreateGoalSuccessfulResponse"] = GqlResolversParentTypes["CreateGoalSuccessfulResponse"],
> = ResolversObject<{
  goal?: Resolver<GqlResolversTypes["Goal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlCreatePlannerResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["CreatePlannerResponse"] = GqlResolversParentTypes["CreatePlannerResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "CreatePlannerSuccessfulResponse" | "ErrorResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlCreatePlannerSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["CreatePlannerSuccessfulResponse"] = GqlResolversParentTypes["CreatePlannerSuccessfulResponse"],
> = ResolversObject<{
  planner?: Resolver<GqlResolversTypes["Planner"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlCreateUserResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["CreateUserResponse"] = GqlResolversParentTypes["CreateUserResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "CreateUserSuccessfulResponse" | "ErrorResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlCreateUserSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["CreateUserSuccessfulResponse"] = GqlResolversParentTypes["CreateUserSuccessfulResponse"],
> = ResolversObject<{
  user?: Resolver<GqlResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlCustomRatioResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["CustomRatio"] = GqlResolversParentTypes["CustomRatio"],
> = ResolversObject<{
  percentage?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  userId?: Resolver<GqlResolversTypes["ObjectID"], ParentType, ContextType>;
}>;

export interface GqlDateTimeScalarConfig
  extends GraphQLScalarTypeConfig<GqlResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type GqlDeleteGoalResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["DeleteGoalResponse"] = GqlResolversParentTypes["DeleteGoalResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "DeleteGoalSuccessfulResponse" | "ErrorResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlDeleteGoalSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["DeleteGoalSuccessfulResponse"] = GqlResolversParentTypes["DeleteGoalSuccessfulResponse"],
> = ResolversObject<{
  deletedId?: Resolver<GqlResolversTypes["ObjectID"], ParentType, ContextType>;
  success?: Resolver<GqlResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlErrorOnFieldResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["ErrorOnField"] = GqlResolversParentTypes["ErrorOnField"],
> = ResolversObject<{
  field?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  message?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
}>;

export type GqlErrorResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["ErrorResponse"] = GqlResolversParentTypes["ErrorResponse"],
> = ResolversObject<{
  fields?: Resolver<
    Maybe<Array<GqlResolversTypes["ErrorOnField"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlGoalResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["Goal"] = GqlResolversParentTypes["Goal"],
> = ResolversObject<{
  amount?: Resolver<GqlResolversTypes["Float"], ParentType, ContextType>;
  category?: Resolver<
    GqlResolversTypes["GoalCategory"],
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  duration?: Resolver<Maybe<GqlResolversTypes["Int"]>, ParentType, ContextType>;
  endDate?: Resolver<
    Maybe<GqlResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  flowType?: Resolver<
    GqlResolversTypes["GoalFlowType"],
    ParentType,
    ContextType
  >;
  id?: Resolver<GqlResolversTypes["ObjectID"], ParentType, ContextType>;
  isCpfEligible?: Resolver<
    GqlResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  monthlyAmount?: Resolver<GqlResolversTypes["Float"], ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  owner?: Resolver<Maybe<GqlResolversTypes["User"]>, ParentType, ContextType>;
  ownerType?: Resolver<
    GqlResolversTypes["GoalOwnerType"],
    ParentType,
    ContextType
  >;
  planner?: Resolver<GqlResolversTypes["Planner"], ParentType, ContextType>;
  remarks?: Resolver<
    Maybe<GqlResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  startDate?: Resolver<
    Maybe<GqlResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
}>;

export type GqlGoalCategoryResolvers = EnumResolverSignature<
  { GOAL?: any; MONTHLY?: any },
  GqlResolversTypes["GoalCategory"]
>;

export type GqlGoalFlowTypeResolvers = EnumResolverSignature<
  { EXPENSE?: any; INVESTMENT?: any; SAVINGS?: any },
  GqlResolversTypes["GoalFlowType"]
>;

export type GqlGoalOwnerTypeResolvers = EnumResolverSignature<
  { PARTNER?: any; SHARED?: any; USER?: any },
  GqlResolversTypes["GoalOwnerType"]
>;

export type GqlJoinPlannerResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["JoinPlannerResponse"] = GqlResolversParentTypes["JoinPlannerResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ErrorResponse" | "JoinPlannerSuccessfulResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlJoinPlannerSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["JoinPlannerSuccessfulResponse"] = GqlResolversParentTypes["JoinPlannerSuccessfulResponse"],
> = ResolversObject<{
  planner?: Resolver<GqlResolversTypes["Planner"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlLeavePlannerResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["LeavePlannerResponse"] = GqlResolversParentTypes["LeavePlannerResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ErrorResponse" | "LeavePlannerSuccessfulResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlLeavePlannerSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["LeavePlannerSuccessfulResponse"] = GqlResolversParentTypes["LeavePlannerSuccessfulResponse"],
> = ResolversObject<{
  success?: Resolver<GqlResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlMutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["Mutation"] = GqlResolversParentTypes["Mutation"],
> = ResolversObject<{
  createGoal?: Resolver<
    GqlResolversTypes["CreateGoalResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreateGoalArgs, "input">
  >;
  createPlanner?: Resolver<
    GqlResolversTypes["CreatePlannerResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreatePlannerArgs, "input">
  >;
  createUser?: Resolver<
    GqlResolversTypes["CreateUserResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreateUserArgs, "input">
  >;
  deleteGoal?: Resolver<
    GqlResolversTypes["DeleteGoalResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationDeleteGoalArgs, "id">
  >;
  deletePlanner?: Resolver<
    GqlResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationDeletePlannerArgs, "id">
  >;
  deleteUser?: Resolver<
    GqlResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationDeleteUserArgs, "id">
  >;
  joinPlanner?: Resolver<
    GqlResolversTypes["JoinPlannerResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationJoinPlannerArgs, "input">
  >;
  leavePlanner?: Resolver<
    GqlResolversTypes["LeavePlannerResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationLeavePlannerArgs, "plannerId">
  >;
  updateGoal?: Resolver<
    GqlResolversTypes["UpdateGoalResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationUpdateGoalArgs, "id" | "input">
  >;
  updateMemberData?: Resolver<
    GqlResolversTypes["UpdateMemberDataResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationUpdateMemberDataArgs, "input" | "plannerId">
  >;
  updateProfile?: Resolver<
    GqlResolversTypes["UpdateProfileResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationUpdateProfileArgs, "input">
  >;
  updateRatioSettings?: Resolver<
    GqlResolversTypes["UpdateRatioSettingsResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationUpdateRatioSettingsArgs, "input" | "plannerId">
  >;
  updateUser?: Resolver<
    GqlResolversTypes["UpdateUserResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationUpdateUserArgs, "id" | "input">
  >;
}>;

export interface GqlObjectIdScalarConfig
  extends GraphQLScalarTypeConfig<GqlResolversTypes["ObjectID"], any> {
  name: "ObjectID";
}

export type GqlPlannerResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["Planner"] = GqlResolversParentTypes["Planner"],
> = ResolversObject<{
  code?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  createdBy?: Resolver<GqlResolversTypes["User"], ParentType, ContextType>;
  customRatios?: Resolver<
    Maybe<Array<GqlResolversTypes["CustomRatio"]>>,
    ParentType,
    ContextType
  >;
  goals?: Resolver<Array<GqlResolversTypes["Goal"]>, ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes["ObjectID"], ParentType, ContextType>;
  members?: Resolver<
    Array<GqlResolversTypes["PlannerMember"]>,
    ParentType,
    ContextType
  >;
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  ratioMode?: Resolver<GqlResolversTypes["RatioMode"], ParentType, ContextType>;
  updatedAt?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
}>;

export type GqlPlannerMemberResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["PlannerMember"] = GqlResolversParentTypes["PlannerMember"],
> = ResolversObject<{
  age?: Resolver<Maybe<GqlResolversTypes["Int"]>, ParentType, ContextType>;
  cpfBreakdown?: Resolver<
    Maybe<GqlResolversTypes["CPFBreakdown"]>,
    ParentType,
    ContextType
  >;
  displayName?: Resolver<
    Maybe<GqlResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  joinedAt?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  monthlyIncome?: Resolver<
    Maybe<GqlResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  role?: Resolver<
    GqlResolversTypes["PlannerMemberRole"],
    ParentType,
    ContextType
  >;
  user?: Resolver<GqlResolversTypes["User"], ParentType, ContextType>;
}>;

export type GqlPlannerMemberRoleResolvers = EnumResolverSignature<
  { MEMBER?: any; OWNER?: any },
  GqlResolversTypes["PlannerMemberRole"]
>;

export type GqlQueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["Query"] = GqlResolversParentTypes["Query"],
> = ResolversObject<{
  getPlanner?: Resolver<
    Maybe<GqlResolversTypes["Planner"]>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryGetPlannerArgs, "id">
  >;
  getPlannerByCode?: Resolver<
    Maybe<GqlResolversTypes["Planner"]>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryGetPlannerByCodeArgs, "code">
  >;
  getUser?: Resolver<
    Maybe<GqlResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryGetUserArgs, "id">
  >;
  me?: Resolver<Maybe<GqlResolversTypes["User"]>, ParentType, ContextType>;
  myPlanners?: Resolver<
    Array<GqlResolversTypes["Planner"]>,
    ParentType,
    ContextType
  >;
}>;

export type GqlRatioModeResolvers = EnumResolverSignature<
  { CUSTOM?: any; INCOME_BASED?: any },
  GqlResolversTypes["RatioMode"]
>;

export type GqlRoleResolvers = EnumResolverSignature<
  { ADMIN?: any; USER?: any },
  GqlResolversTypes["Role"]
>;

export type GqlSubscriptionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["Subscription"] = GqlResolversParentTypes["Subscription"],
> = ResolversObject<{
  _noop?: SubscriptionResolver<
    Maybe<GqlResolversTypes["Boolean"]>,
    "_noop",
    ParentType,
    ContextType
  >;
}>;

export type GqlUpdateGoalResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateGoalResponse"] = GqlResolversParentTypes["UpdateGoalResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ErrorResponse" | "UpdateGoalSuccessfulResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlUpdateGoalSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateGoalSuccessfulResponse"] = GqlResolversParentTypes["UpdateGoalSuccessfulResponse"],
> = ResolversObject<{
  goal?: Resolver<GqlResolversTypes["Goal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlUpdateMemberDataResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateMemberDataResponse"] = GqlResolversParentTypes["UpdateMemberDataResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ErrorResponse" | "UpdateMemberDataSuccessfulResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlUpdateMemberDataSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateMemberDataSuccessfulResponse"] = GqlResolversParentTypes["UpdateMemberDataSuccessfulResponse"],
> = ResolversObject<{
  planner?: Resolver<GqlResolversTypes["Planner"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlUpdateProfileResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateProfileResponse"] = GqlResolversParentTypes["UpdateProfileResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ErrorResponse" | "UpdateProfileSuccessfulResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlUpdateProfileSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateProfileSuccessfulResponse"] = GqlResolversParentTypes["UpdateProfileSuccessfulResponse"],
> = ResolversObject<{
  user?: Resolver<GqlResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlUpdateRatioSettingsResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateRatioSettingsResponse"] = GqlResolversParentTypes["UpdateRatioSettingsResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ErrorResponse" | "UpdateRatioSettingsSuccessfulResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlUpdateRatioSettingsSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateRatioSettingsSuccessfulResponse"] = GqlResolversParentTypes["UpdateRatioSettingsSuccessfulResponse"],
> = ResolversObject<{
  planner?: Resolver<GqlResolversTypes["Planner"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlUpdateUserResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateUserResponse"] = GqlResolversParentTypes["UpdateUserResponse"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ErrorResponse" | "UpdateUserSuccessfulResponse",
    ParentType,
    ContextType
  >;
}>;

export type GqlUpdateUserSuccessfulResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["UpdateUserSuccessfulResponse"] = GqlResolversParentTypes["UpdateUserSuccessfulResponse"],
> = ResolversObject<{
  user?: Resolver<GqlResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlUserResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["User"] = GqlResolversParentTypes["User"],
> = ResolversObject<{
  createdAt?: Resolver<
    Maybe<GqlResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  displayName?: Resolver<
    Maybe<GqlResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  email?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes["ObjectID"], ParentType, ContextType>;
  image?: Resolver<Maybe<GqlResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<GqlResolversTypes["String"]>, ParentType, ContextType>;
  planners?: Resolver<
    Array<GqlResolversTypes["Planner"]>,
    ParentType,
    ContextType
  >;
  provider?: Resolver<
    Maybe<GqlResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  providerAccountId?: Resolver<
    Maybe<GqlResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  role?: Resolver<GqlResolversTypes["Role"], ParentType, ContextType>;
  updatedAt?: Resolver<
    Maybe<GqlResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
}>;

export type GqlResolvers<ContextType = GraphQLContext> = ResolversObject<{
  CPFBreakdown?: GqlCpfBreakdownResolvers<ContextType>;
  CreateGoalResponse?: GqlCreateGoalResponseResolvers<ContextType>;
  CreateGoalSuccessfulResponse?: GqlCreateGoalSuccessfulResponseResolvers<ContextType>;
  CreatePlannerResponse?: GqlCreatePlannerResponseResolvers<ContextType>;
  CreatePlannerSuccessfulResponse?: GqlCreatePlannerSuccessfulResponseResolvers<ContextType>;
  CreateUserResponse?: GqlCreateUserResponseResolvers<ContextType>;
  CreateUserSuccessfulResponse?: GqlCreateUserSuccessfulResponseResolvers<ContextType>;
  CustomRatio?: GqlCustomRatioResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DeleteGoalResponse?: GqlDeleteGoalResponseResolvers<ContextType>;
  DeleteGoalSuccessfulResponse?: GqlDeleteGoalSuccessfulResponseResolvers<ContextType>;
  ErrorOnField?: GqlErrorOnFieldResolvers<ContextType>;
  ErrorResponse?: GqlErrorResponseResolvers<ContextType>;
  Goal?: GqlGoalResolvers<ContextType>;
  GoalCategory?: GqlGoalCategoryResolvers;
  GoalFlowType?: GqlGoalFlowTypeResolvers;
  GoalOwnerType?: GqlGoalOwnerTypeResolvers;
  JoinPlannerResponse?: GqlJoinPlannerResponseResolvers<ContextType>;
  JoinPlannerSuccessfulResponse?: GqlJoinPlannerSuccessfulResponseResolvers<ContextType>;
  LeavePlannerResponse?: GqlLeavePlannerResponseResolvers<ContextType>;
  LeavePlannerSuccessfulResponse?: GqlLeavePlannerSuccessfulResponseResolvers<ContextType>;
  Mutation?: GqlMutationResolvers<ContextType>;
  ObjectID?: GraphQLScalarType;
  Planner?: GqlPlannerResolvers<ContextType>;
  PlannerMember?: GqlPlannerMemberResolvers<ContextType>;
  PlannerMemberRole?: GqlPlannerMemberRoleResolvers;
  Query?: GqlQueryResolvers<ContextType>;
  RatioMode?: GqlRatioModeResolvers;
  Role?: GqlRoleResolvers;
  Subscription?: GqlSubscriptionResolvers<ContextType>;
  UpdateGoalResponse?: GqlUpdateGoalResponseResolvers<ContextType>;
  UpdateGoalSuccessfulResponse?: GqlUpdateGoalSuccessfulResponseResolvers<ContextType>;
  UpdateMemberDataResponse?: GqlUpdateMemberDataResponseResolvers<ContextType>;
  UpdateMemberDataSuccessfulResponse?: GqlUpdateMemberDataSuccessfulResponseResolvers<ContextType>;
  UpdateProfileResponse?: GqlUpdateProfileResponseResolvers<ContextType>;
  UpdateProfileSuccessfulResponse?: GqlUpdateProfileSuccessfulResponseResolvers<ContextType>;
  UpdateRatioSettingsResponse?: GqlUpdateRatioSettingsResponseResolvers<ContextType>;
  UpdateRatioSettingsSuccessfulResponse?: GqlUpdateRatioSettingsSuccessfulResponseResolvers<ContextType>;
  UpdateUserResponse?: GqlUpdateUserResponseResolvers<ContextType>;
  UpdateUserSuccessfulResponse?: GqlUpdateUserSuccessfulResponseResolvers<ContextType>;
  User?: GqlUserResolvers<ContextType>;
}>;
