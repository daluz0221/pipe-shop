import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 
  webpack(config, { isServer }) {
    if (!isServer) {
      config.externals.push("fs"); // evitar errores si se importa Prisma accidentalmente en frontend
    }
    return config;
  },
};

export default nextConfig;
