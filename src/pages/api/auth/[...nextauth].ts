import NextAuth from 'next-auth';
import Auth0Provider from "next-auth/providers/auth0"
import getConfig from 'next/config';
import {generateToken} from '../../../token';

const {serverRuntimeConfig} = getConfig();

const options = {
    secret: serverRuntimeConfig.appSecret,
    providers: [
        Auth0Provider(serverRuntimeConfig.auth0),
    ],
    callbacks: {
        jwt: async ({
            token,
            user,
            profile
        }: any) => {
            if (user) {
                // This is bad but NextAuth requires it
                token.user = profile;
            }
            return Promise.resolve(token);
        },
        session: async ({
            session,
            token
        }: any) => Promise.resolve({
            ...session,

            // @ts-expect-error TS(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
            ...(await generateToken(token.user.nickname)),
            user: token.user,
        }),
    },
};

export default (req: any, res: any) => NextAuth(req, res, options);
