import { JsonWebTokenError, sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { apiFetch } from '@codeday/topo/utils';
import getConfig from 'next/config';
import NodeCache from 'node-cache';
import { graphql } from 'generated/gql';
import { ResultOf } from '@graphql-typed-document-node/core';

const query = graphql(`
  query AccountRoles($username: String!) {
    account {
      getUser(where: { username: $username }) {
        id
        roles {
          id
        }
      }
    }
  }
`);

export interface TokenInfo {
  clearAuthToken: string;
  isAdmin: boolean;
  isManager: boolean;
}

const cache = new NodeCache();
const { serverRuntimeConfig } = getConfig();

function signToken(payload: object) {
  return sign(payload, serverRuntimeConfig.gql.secret, {
    expiresIn: '90m',
    audience: serverRuntimeConfig.gql.audience,
  });
}

export function checkToken(token: string) {
  try {
    if (verify(token, serverRuntimeConfig.gql.secret, { audience: serverRuntimeConfig.gql.audience })) {
      return true;
    }
  } catch (e) {
    if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
      return false;
    }
    throw e;
  }
}

export async function generateToken(username: string): Promise<TokenInfo> {
  const cachedToken = cache.get<TokenInfo>(username);
  if (cachedToken && checkToken(cachedToken.clearAuthToken)) {
    return cachedToken;
  }
  const accountToken = sign({ scopes: `read:users` }, serverRuntimeConfig.gql.accountSecret, { expiresIn: '10s' });
  const result: ResultOf<typeof query> = await apiFetch(
    query,
    { username },
    { Authorization: `Bearer ${accountToken}` },
  );
  const roleIds = (result.account?.getUser?.roles || []).map((r) => r.id);
  const isAdmin =
    roleIds.includes(serverRuntimeConfig.auth0.roles.employee) ||
    roleIds.includes(serverRuntimeConfig.auth0.roles.admin);
  const isManager = roleIds.includes(serverRuntimeConfig.auth0.roles.manager);

  let token;
  if (isAdmin) {
    token = signToken({ t: 'A' });
  } else if (isManager) {
    token = signToken({ t: 'm', u: username });
  } else {
    throw new Error('Cannot generate token with no permissions');
  }
  const tokenInfo = { clearAuthToken: token, isAdmin, isManager };
  cache.set(username, tokenInfo);
  return tokenInfo;
}
