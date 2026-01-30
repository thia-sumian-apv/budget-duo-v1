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

export default nextConfig;
