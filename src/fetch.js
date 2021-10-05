import {GraphQLClient} from "graphql-request";
// import {apiFetch} from '@codeday/topo/utils' // TODO: UNCOMMENT ONCE clear-gql deployed

// TODO: remove once clear-gql deployed

export const apiFetch = function apiFetch(query, variables, headers) {
    const client = new GraphQLClient('http://localhost:4000', {
        headers: headers
    });
    return client.request(query, variables);
};

export function useFetcher(session, variables) {
    return (q, v, h) => apiFetch(q, {...v, ...variables}, {
        ...h,
        'X-Clear-Authorization': `Bearer ${session?.clearAuthToken}`
    })
}
