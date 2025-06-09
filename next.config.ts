import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },

  webpack(config, { isServer }) {
    if (!isServer) {
      config.externals.push("fs"); // evitar errores si se importa Prisma accidentalmente en frontend
    }
    return config;
  },
};

export default nextConfig;
