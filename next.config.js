module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/assets/auth', destination: '/api/assets/auth' },
      { source: '/set_state', destination: '/api/set_state' },
    ];
  },
};
