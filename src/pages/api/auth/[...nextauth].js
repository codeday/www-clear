import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import getConfig from 'next/config';
import {generateToken} from '../../../token';

const {serverRuntimeConfig} = getConfig();

const options = {
    secret: serverRuntimeConfig.appSecret,
    providers: [
        Providers.Auth0(serverRuntimeConfig.auth0),
    ],
    callbacks: {
        jwt: async (token, user, _, profile) => {
            if (user) {
                // This is bad but NextAuth requires it
                token.user = profile;
            }
            return Promise.resolve(token);
        },
        session: async (session, {user}) => Promise.resolve({
            ...session,
            clearAuthToken: await generateToken(user.nickname),
            user,
        }),
    },
};

export default (req, res) => NextAuth(req, res, options);
