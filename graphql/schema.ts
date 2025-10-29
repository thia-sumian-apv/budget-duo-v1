import { makeExecutableSchema } from "@graphql-tools/schema";

// asynchronously load types definition and implementations
const { default: typeDefs } = await import("./schema/typeDefs");

// import the resolvers
const { default: resolvers } = await import("./resolvers");

// turn the schema into an executable
const schema = makeExecutableSchema({ typeDefs: [typeDefs], resolvers });

export default schema;
