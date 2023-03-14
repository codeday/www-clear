import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import getConfig from 'next/config';
import { generateToken } from '../../../token';

const { serverRuntimeConfig } = getConfig();

const options = {
  secret: serverRuntimeConfig.appSecret,
  providers: [
    Auth0Provider(serverRuntimeConfig.auth0),
  ],
  callbacks: {
    jwt: async ({ token, user, profile }) => {
      if (user) {
        // This is bad but NextAuth requires it
        token.user = profile;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => Promise.resolve({
      ...session,
      ...await generateToken(token.user.nickname),
      user: token.user,
    }),
  },
};

export default (req, res) => NextAuth(req, res, options);
