/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_MARKETPLACE_ADDRESS: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '0x...',
    NEXT_PUBLIC_USDC_ADDRESS: '0x833589fCD6eDb6E08f4c7C32D4f71b3bA3a393F3',
    NEXT_PUBLIC_MONITOR_ADDRESS: '0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3',
  },
};

module.exports = nextConfig;
