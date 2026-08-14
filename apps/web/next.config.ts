import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@compareall/shared-types', '@compareall/engine', '@compareall/storage'],
  reactStrictMode: true,
  turbopack: {},
};

export default nextConfig;
