/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
    serverComponentsExternalPackages: ['sharp']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    domains: ['cdn.henmo.ai', 'images.unsplash.com']
  },
  swcMinify: true,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Frame-Options', value: 'DENY' }
      ]
    },
    {
      source: '/static/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
    }
  ],
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 244000,
        cacheGroups: {
          vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all' },
          common: { minChunks: 2, chunks: 'all', priority: 5 }
        }
      }
    }
    return config
  }
}

module.exports = nextConfig