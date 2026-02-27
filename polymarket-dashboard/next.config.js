/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Allow static generation
  reactStrictMode: true,
};

module.exports = nextConfig;
