/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");
const { i18n } = require("./next-i18next.config.js");

const nextConfig = {
  reactStrictMode: true,
  i18n,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "*.scdn.co" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  experimental: {
    instrumentationHook: true,
  },
  // CORS 및 캐시 헤더 설정 추가
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://tracklistnow.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  hideSourceMaps: true,
};

const sentryBuildOptions = {
  hideSourceMaps: true,
  widenClientFileUpload: true,
  disableServerWebpackPlugin: false,
  disableClientWebpackPlugin: false,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring-tunnel",
  include: ".",
  ignore: ["node_modules", "webpack.config.js"],
};

module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  sentryBuildOptions,
);
