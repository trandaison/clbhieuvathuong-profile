import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',

  // Handle network timeouts for external resources
  experimental: {
    optimisticClientCache: false,
  },

  // Add headers for font loading
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ],
      },
    ]
  },
};

export default nextConfig;
