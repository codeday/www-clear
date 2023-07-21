import {createContext, useContext} from 'react';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import get from 'lodash.get';

const QueryContext = createContext({});

export const QueryProvider = QueryContext.Provider;

export function useQuery(key: any, def: any) {
    const obj = useContext(QueryContext);
    if (!key) return obj;
    return get(obj, key, def || null);
}
