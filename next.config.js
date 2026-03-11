/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/assets/:path*', destination: '/api/assets/:path*' },
      { source: '/set_state', destination: '/api/set_state' }
    ]
  }
}
module.exports = nextConfig;