const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = {
  ...withBundleAnalyzer({}),
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  serverRuntimeConfig: {
    auth0: {
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      issuer: `https://` + process.env.AUTH0_DOMAIN,
      roles: {
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
};
