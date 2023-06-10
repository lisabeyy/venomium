/** @type {import('next').NextConfig} */

const nextConfig = {

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
