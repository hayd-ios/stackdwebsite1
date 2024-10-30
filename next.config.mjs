/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/public/app-ads.txt',
        destination: '/app-ads.txt',
      },
    ];
  },
}

export default nextConfig;
