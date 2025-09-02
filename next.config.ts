import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for better Telegram WebApp compatibility
  output: 'standalone',
  
  // Disable image optimization for Telegram WebApp
  images: {
    unoptimized: true,
    domains: ['telegram.org', 't.me'],
  },
  
  // Environment variables
  env: {
    BOT_TOKEN: '7263698684:AAHvGN7Ea2cin_0JKiPLt2Lvvr8pCAGHPR8'
  },
  
  // Add security headers for Telegram WebApp
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
