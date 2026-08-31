import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // there is a stray package lock.json in the home directory, which makes next
  // guess the wrong workspace root and trace the wrong files.
  outputFileTracingRoot: __dirname,
  /* config options here */
};

export default nextConfig;
