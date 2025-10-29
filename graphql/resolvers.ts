import type { Session } from "next-auth";
import { mapValues } from "./utils";
const withTrailing = <T extends (...args: any[]) => any>(resolver: T): T =>
  resolver;
const enums = {} as const;
// If you enable codegen, prefer importing the generated type, e.g.:
// import type { Resolvers as GqlResolvers } from './__generated__/types';
type GqlResolvers = any;

export interface GraphQLContext {
  session: Session | null;
}

// compose the resolvers
const { default: types } = await import("./types/index");
const { default: Query } = await import("./queries/index");
const { default: Mutation } = await import("./mutations/index");
const { default: Subscription } = await import("./subscriptions/index");

const resolvers: GqlResolvers = {
  ...enums,
  ...types,
  Query: mapValues(withTrailing as any, Query as any) as any,
  Mutation: mapValues(withTrailing as any, Mutation as any) as any,
  Subscription,
};

export default resolvers;
