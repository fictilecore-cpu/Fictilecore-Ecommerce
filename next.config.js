/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "143.244.142.60",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "fictilecore.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.fictilecore.com",
        pathname: "/uploads/**",
      },
    ],

    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days cache
  },
};

module.exports = nextConfig;