import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  agentRules: false,
  allowedDevOrigins: ["127.0.0.1", "*.trycloudflare.com"],
};

export default nextConfig;
