/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/assets/list',
        destination: '/api/assets/list',
      },
      {
        source: '/assets/auth/status',
        destination: '/api/assets/auth/status',
      },
    ];
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
};

export default config;
