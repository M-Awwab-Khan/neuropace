import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,

    serverExternalPackages: ["pdf-parse"],

};

export default nextConfig;
