import {apiFetch} from '@codeday/topo/utils'

export function useFetcher(session, variables) {
    return (q, v, h) => apiFetch(q, {...v, ...variables}, {
        ...h,
        'X-Clear-Authorization': `Bearer ${session?.clearAuthToken}`
    })
}
