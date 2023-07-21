import {apiFetch, useToasts} from '@codeday/topo/utils'
import {useSession} from 'next-auth/react';

export function useFetcher(_: any, variables: any) {
    const { data: session } = useSession();
    const { error } = useToasts();
    if (!session || !session?.clearAuthToken) return () => error(`Session token not provided.`);
    return (q: any, v: any, h: any) => apiFetch(q, {...v, ...variables}, {
        ...h,
        'X-Clear-Authorization': `Bearer ${session?.clearAuthToken}`
    });
}

export function getFetcher(session: any, variables: any) {
    if (!session || !session?.clearAuthToken) return () => { throw new Error(`Session token not provided.`) };
    return (q: any, v: any, h: any) => apiFetch(q, {...v, ...variables}, {
        ...h,
        'X-Clear-Authorization': `Bearer ${session?.clearAuthToken}`
    });
}
