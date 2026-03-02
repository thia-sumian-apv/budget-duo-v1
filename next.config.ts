import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // GitHub avatars (NextAuth GitHub provider)
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Google profile images (NextAuth Google provider)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Configure webpack to handle .graphql file imports
  webpack: (config) => {
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [{ loader: "graphql-tag/loader" }],
    });
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  // Upload source maps for better stack traces in production
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print upload logs during CI builds
  silent: !process.env.CI,

  // Upload and then delete source maps so they don't ship to the client
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",
});
