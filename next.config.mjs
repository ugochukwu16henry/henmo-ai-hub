/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/hub',
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
    appDir: 'apps/hub/app',
    // This tells Turbopack/Next.js where to look for the monorepo root
    turbopack: {
      root: '../../',
    },
  },
  distDir: '.next',
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
