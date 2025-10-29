import { Role } from "@/types";
import { ObjectId } from "mongodb";
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { UserDocument } from "@/types";
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
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
export type EnumResolverSignature<T, AllowedValues = any> = {
  [key in keyof T]?: AllowedValues;
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

export type GqlErrorOnField = {
  __typename?: "ErrorOnField";
  field: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
};

export type GqlErrorResponse = {
  __typename?: "ErrorResponse";
  fields?: Maybe<Array<GqlErrorOnField>>;
};

export type GqlMutation = {
  __typename?: "Mutation";
  createUser: GqlCreateUserResponse;
  deleteUser: Scalars["Boolean"]["output"];
  updateUser: GqlUpdateUserResponse;
};

export type GqlMutationCreateUserArgs = {
  input: GqlCreateUserInput;
};

export type GqlMutationDeleteUserArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlMutationUpdateUserArgs = {
  id: Scalars["ID"]["input"];
  input: GqlUpdateUserInput;
};

export type GqlQuery = {
  __typename?: "Query";
  getUser?: Maybe<GqlUser>;
};

export type GqlQueryGetUserArgs = {
  id: Scalars["ObjectID"]["input"];
};

export { Role };

export type GqlSubscription = {
  __typename?: "Subscription";
  _noop?: Maybe<Scalars["Boolean"]["output"]>;
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
  email: Scalars["String"]["output"];
  id: Scalars["ObjectID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
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
    CreateUserResponse:
      | (Omit<GqlCreateUserSuccessfulResponse, "user"> & {
          user: _RefType["User"];
        })
      | GqlErrorResponse;
    UpdateUserResponse:
      | GqlErrorResponse
      | (Omit<GqlUpdateUserSuccessfulResponse, "user"> & {
          user: _RefType["User"];
        });
  }>;

/** Mapping between all available schema types and the resolvers types */
export type GqlResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  CreateUserInput: GqlCreateUserInput;
  CreateUserResponse: ResolverTypeWrapper<
    GqlResolversUnionTypes<GqlResolversTypes>["CreateUserResponse"]
  >;
  CreateUserSuccessfulResponse: ResolverTypeWrapper<
    Omit<GqlCreateUserSuccessfulResponse, "user"> & {
      user: GqlResolversTypes["User"];
    }
  >;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]["output"]>;
  ErrorOnField: ResolverTypeWrapper<GqlErrorOnField>;
  ErrorResponse: ResolverTypeWrapper<GqlErrorResponse>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ObjectID: ResolverTypeWrapper<Scalars["ObjectID"]["output"]>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Role: Role;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
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
  CreateUserInput: GqlCreateUserInput;
  CreateUserResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["CreateUserResponse"];
  CreateUserSuccessfulResponse: Omit<
    GqlCreateUserSuccessfulResponse,
    "user"
  > & { user: GqlResolversParentTypes["User"] };
  DateTime: Scalars["DateTime"]["output"];
  ErrorOnField: GqlErrorOnField;
  ErrorResponse: GqlErrorResponse;
  ID: Scalars["ID"]["output"];
  Mutation: Record<PropertyKey, never>;
  ObjectID: Scalars["ObjectID"]["output"];
  Query: Record<PropertyKey, never>;
  String: Scalars["String"]["output"];
  Subscription: Record<PropertyKey, never>;
  UpdateUserInput: GqlUpdateUserInput;
  UpdateUserResponse: GqlResolversUnionTypes<GqlResolversParentTypes>["UpdateUserResponse"];
  UpdateUserSuccessfulResponse: Omit<
    GqlUpdateUserSuccessfulResponse,
    "user"
  > & { user: GqlResolversParentTypes["User"] };
  User: UserDocument;
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

export interface GqlDateTimeScalarConfig
  extends GraphQLScalarTypeConfig<GqlResolversTypes["DateTime"], any> {
  name: "DateTime";
}

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

export type GqlMutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["Mutation"] = GqlResolversParentTypes["Mutation"],
> = ResolversObject<{
  createUser?: Resolver<
    GqlResolversTypes["CreateUserResponse"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreateUserArgs, "input">
  >;
  deleteUser?: Resolver<
    GqlResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<GqlMutationDeleteUserArgs, "id">
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

export type GqlQueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    GqlResolversParentTypes["Query"] = GqlResolversParentTypes["Query"],
> = ResolversObject<{
  getUser?: Resolver<
    Maybe<GqlResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryGetUserArgs, "id">
  >;
}>;

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
  email?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes["ObjectID"], ParentType, ContextType>;
  image?: Resolver<Maybe<GqlResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<GqlResolversTypes["String"]>, ParentType, ContextType>;
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
  CreateUserResponse?: GqlCreateUserResponseResolvers<ContextType>;
  CreateUserSuccessfulResponse?: GqlCreateUserSuccessfulResponseResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  ErrorOnField?: GqlErrorOnFieldResolvers<ContextType>;
  ErrorResponse?: GqlErrorResponseResolvers<ContextType>;
  Mutation?: GqlMutationResolvers<ContextType>;
  ObjectID?: GraphQLScalarType;
  Query?: GqlQueryResolvers<ContextType>;
  Role?: GqlRoleResolvers;
  Subscription?: GqlSubscriptionResolvers<ContextType>;
  UpdateUserResponse?: GqlUpdateUserResponseResolvers<ContextType>;
  UpdateUserSuccessfulResponse?: GqlUpdateUserSuccessfulResponseResolvers<ContextType>;
  User?: GqlUserResolvers<ContextType>;
}>;
