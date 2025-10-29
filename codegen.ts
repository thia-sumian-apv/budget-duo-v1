import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./graphql/schema/**/*.graphql",
  generates: {
    "./graphql/__generated__/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useIndexSignature: true,
        contextType: "@/graphql/resolvers#GraphQLContext",
        typesPrefix: "Gql",
        mappers: {
          User: "@/types#UserDocument",
        },
        enumValues: {
          Role: "@/types#Role",
        },
        scalars: {
          ObjectID: "mongodb#ObjectId",
          DateTime: "string",
        },
      },
    },
    // Client operations (if you write .graphql documents later)
    // "./graphql/__generated__/operations.ts": {
    //   documents: "./**/*.graphql",
    //   plugins: ["typescript", "typescript-operations"],
    // },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
