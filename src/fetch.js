import {GraphQLClient} from "graphql-request";
import {apiFetch} from '@codeday/topo/utils'
import {validate} from "graphql";

export function useLocalhostFetcher(variables) { // TODO: Replace with ApiFetch once clear-gql deployed
    const client = new GraphQLClient('http://localhost:5000/graphql')
    return (q, v, h) => client.request(q, {...v, ...variables})
}

export function useFetcher(variables) {
    return (q, v, h) => apiFetch(q, {...v, ...variables})
}
