import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            // Avoid year-long immutable caching so replaced product photos update on deploy.
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
