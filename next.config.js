/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/page',
        destination: '/',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'testnet.web3.world',
        port: '',
        pathname: '/token-icons/**',
      },
    ],
  },
};

module.exports = nextConfig;
