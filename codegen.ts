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
    // Client types + hooks for React (near .graphql files)
    "./app/apolloClient.types.ts": {
      plugins: ["typescript"],
      config: {
        scalars: {
          ObjectID: "string",
          DateTime: "string",
        },
        nonOptionalTypename: true,
      },
    },
    "./app/": {
      documents: "./app/**/*.graphql",
      preset: "near-operation-file",
      presetConfig: {
        extension: ".api.ts",
        baseTypesPath: "apolloClient.types.ts",
        importTypesNamespace: "SchemaTypes",
      },
      plugins: ["typescript-operations", "typescript-react-apollo"],
      config: {
        withHooks: true,
        documentMode: "graphQLTag",
        nonOptionalTypename: true,
        scalars: {
          ObjectID: "string",
          DateTime: "string",
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
