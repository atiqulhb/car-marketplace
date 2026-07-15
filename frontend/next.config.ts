import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    staleTimes: {
      dynamic: 0
    }
  }
};

export default nextConfig;
