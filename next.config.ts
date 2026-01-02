import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // GitHub avatars (NextAuth GitHub provider)
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Google profile images (NextAuth Google provider)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // IMPORTANT (serverless): our GraphQL schema is loaded from *.graphql files at runtime
  // via @graphql-tools/load-files. Ensure Next/Vercel traces and bundles these files.
  //
  // Without this, production may build a schema missing domain types (e.g. `User`),
  // causing: `"User" defined in resolvers, but not in schema`.
  outputFileTracingIncludes: {
    "/api/graphql": ["./graphql/schema/**/*.graphql"],
  },
};

export default nextConfig;
