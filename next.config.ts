import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Product photos are already optimized in sync-assets; skip Vercel `/_next/image`
    // so middleware/edge cache issues can't blank out the catalog on production.
    unoptimized: true,
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
