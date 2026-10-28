import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aiforbusinesshub.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blogs',
        destination: '/#articles',
        permanent: true,
      },
      {
        source: '/blogs/:path*',
        destination: '/#articles',
        permanent: true,
      },
      {
        source: '/work-with-pro',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/work-with-pro/:path*',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/authors',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/authors/:path*',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/author/:slug*',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
