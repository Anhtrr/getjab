import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export only for production builds (Capacitor/PWA).
  // Dev server handles dynamic routes (custom workouts) without it.
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
