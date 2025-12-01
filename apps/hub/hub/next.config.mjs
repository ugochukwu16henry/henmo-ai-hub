import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use standalone output for production builds (Docker deployments)
  // For local development, this is disabled to allow 'next start' to work
  ...(process.env.NODE_ENV === 'production' && process.env.STANDALONE_BUILD === 'true' 
    ? { output: 'standalone' } 
    : {}),
  // Only use basePath when BASE_PATH env var is explicitly set
  // For local development, routes work without /hub prefix
  // For production/Docker, set BASE_PATH=/hub to enable the prefix
  ...(process.env.BASE_PATH ? { basePath: process.env.BASE_PATH } : {}),
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: '.next',
  // Use webpack instead of Turbopack for now (Turbopack has path resolution issues in monorepo)
  // turbopack: {},
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'henmo-ai-files-production.s3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'your-cloudfront-domain.cloudfront.net'
      }
    ],
    formats: ['image/webp', 'image/avif']
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
