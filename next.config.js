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
