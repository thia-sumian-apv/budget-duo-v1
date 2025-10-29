import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Keep turbopack; no change needed for GraphQL route
  },
};

export default nextConfig;
