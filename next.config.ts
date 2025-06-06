import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://coqykldng3.ufs.sh/**")],
    domains: ["utfs.io"],
  },
  devIndicators: false,
};

export default nextConfig;
