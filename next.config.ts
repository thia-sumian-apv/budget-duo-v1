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
  experimental: {
    // Keep turbopack; no change needed for GraphQL route
  },
};

export default nextConfig;
