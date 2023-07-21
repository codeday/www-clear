
// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'json... Remove this comment to see the full error message
import {JsonWebTokenError, sign, TokenExpiredError, verify} from "jsonwebtoken";

// @ts-expect-error TS(2307) FIXME: Cannot find module './getAccountRoles.gql' or its ... Remove this comment to see the full error message
import {GetAccountRolesQuery} from "./getAccountRoles.gql";
import {apiFetch} from "@codeday/topo/utils";
import getConfig from "next/config";
import NodeCache from "node-cache";

const cache = new NodeCache()
const {serverRuntimeConfig} = getConfig();

function signToken(payload: any) {
    return sign(payload, serverRuntimeConfig.gql.secret, {expiresIn: '90m', audience: serverRuntimeConfig.gql.audience})
}

export function checkToken(token: any) {
    if (!token) return false
    try {
        if (verify(token, serverRuntimeConfig.gql.secret, {audience: serverRuntimeConfig.gql.audience})) {
            return true
        }
    } catch (e) {
        if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
            return false
        } else throw e
    }
}

export async function generateToken(username: any) {
    const cachedToken = cache.get(username)
    if (checkToken(cachedToken)) {
        return cachedToken
    }
    const accountToken = sign({scopes: `read:users`}, serverRuntimeConfig.gql.accountSecret, {expiresIn: '10s'});
    const {account} = await apiFetch(GetAccountRolesQuery, {username: username}, {'Authorization': `Bearer ${accountToken}`})
    const roleIds = (account?.getUser?.roles || []).map((r: any) => r.id);
    const isAdmin = roleIds.includes(serverRuntimeConfig.auth0.roles.employee) || roleIds.includes(serverRuntimeConfig.auth0.roles.admin);
    const isManager = roleIds.includes(serverRuntimeConfig.auth0.roles.manager);

    let token;
    if (isAdmin) {
        token = signToken({t: 'A'})
    } else if (isManager) {
        token = signToken({t: 'm', u: username})
    }
    const tokenInfo = { clearAuthToken: token, isAdmin, isManager }
    cache.set(username, tokenInfo)
    return tokenInfo;
}
