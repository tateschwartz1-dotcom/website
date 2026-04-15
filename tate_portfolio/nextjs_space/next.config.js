const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  skipTrailingSlashRedirect: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/johnbox/socket.io',
        destination: 'https://partypack.onrender.com/socket.io',
      },
      {
        source: '/johnbox/socket.io/:path*',
        destination: 'https://partypack.onrender.com/socket.io/:path*',
      },
      {
        source: '/johnbox',
        destination: 'https://partypack.onrender.com/johnbox/',
      },
      {
        source: '/johnbox/:path*',
        destination: 'https://partypack.onrender.com/johnbox/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
