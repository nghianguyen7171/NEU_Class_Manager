import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_GIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? ""
  }
};

export default nextConfig;
