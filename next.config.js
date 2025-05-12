/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'ui-avatars.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/student',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig
