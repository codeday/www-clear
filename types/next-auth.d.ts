/* eslint-disable no-unused-vars */
import { Auth0Profile } from 'next-auth/providers/auth0';
import { TokenInfo } from '../src/token';

declare module 'next-auth/jwt' {
  interface JWT {
    user: Auth0Profile;
  }
}

declare module 'next-auth' {
  interface Session extends TokenInfo {
    user: Auth0Profile;
  }
}
