/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/hub',
  appDir: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
    turbopack: {
      root: './',
      rules: {
        '*.{js,jsx,ts,tsx}': {
          loaders: [
            {
              loader: '@next/swc-loader',
              options: {
                isDevelopment: true,
                baseDirectory: 'C:/Users/user/Documents/henmo-AI/henmo-ai/apps/hub',
              },
            },
          ],
        },
      },
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
