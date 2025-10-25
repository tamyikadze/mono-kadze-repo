import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {},
  reactCompiler: true,
  transpilePackages: ['@repo/ui', '@repo/sdk'],
}

export default nextConfig
