/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No need for appDir experimental flag in Next.js 13+
  // Newer versions automatically detect and use the app directory

  // Configure image domains and allow SVGs
  images: {
    domains: [
      "localhost",
      "about.twitter.com",
      "i.pinimg.com",
      "randomuser.me",
      "gateway.pinata.cloud",
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Ensure typescript errors don't prevent development
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },

  // Properly handle SVG files
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
