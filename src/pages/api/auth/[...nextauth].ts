import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Auth0Provider, { Auth0Profile } from 'next-auth/providers/auth0';
import getConfig from 'next/config';
import { generateToken } from '../../../token';

const { serverRuntimeConfig } = getConfig();

const options: NextAuthOptions = {
  secret: serverRuntimeConfig.appSecret,
  providers: [Auth0Provider(serverRuntimeConfig.auth0)],
  callbacks: {
    jwt: async ({ token, user, profile }) => {
      if (user) {
        // This is bad but NextAuth requires it
        token.user = profile as Auth0Profile;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) =>
      Promise.resolve({
        ...session,
        ...(await generateToken((token.user as Auth0Profile).nickname)),
        user: token.user,
      }),
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
