import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: true,
  transpilePackages: ['@repo/ui', '@repo/sdk'],
}

export default nextConfig
