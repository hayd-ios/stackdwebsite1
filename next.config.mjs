/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/public/app-ads.txt",
        destination: "/app-ads.txt",
      },
    ];
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "storage.googleapis.com"],
  },
};

export default nextConfig;
