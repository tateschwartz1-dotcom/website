const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/johnbox',
        destination: 'https://partypack.onrender.com/johnbox/',
        permanent: false,
      },
      {
        source: '/johnbox/:path*',
        destination: 'https://partypack.onrender.com/johnbox/:path*',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
