const moment = require('moment-timezone');
const shouldAnalyzeBundles = process.env.ANALYZE === 'true';

moment.tz.setDefault('Etc/UTC');

let nextConfig = {
  experimental: { newNextLinkBehavior: false },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverRuntimeConfig: {
    auth0: {
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      issuer: `https://${process.env.AUTH0_DOMAIN}`,
      roles: {
        employee: process.env.AUTH0_EMPLOYEE_ROLE,
        admin: process.env.AUTH0_ADMIN_ROLE,
        manager: process.env.AUTH0_MANAGER_ROLE,
        volunteer: process.env.AUTH0_VOLUNTEER_ROLE,
        // attendee: process.env.AUTH0_ATTENDEE_ROLE
      },
    },
    gql: {
      secret: process.env.GQL_SECRET,
      accountSecret: process.env.GQL_ACCOUNT_SECRET,
      audience: process.env.GQL_AUDIENCE,
    },
    appUrl: process.env.APP_URL,
  },
  webpack: (config, {
    buildId, dev, isServer, defaultLoaders, webpack,
  }) => {
    config?.module?.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
};

if (shouldAnalyzeBundles) {
  const withNextBundleAnalyzer = require('next-bundle-analyzer')();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
