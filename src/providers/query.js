import { createContext, useContext } from 'react';
import get from 'lodash.get';

const QueryContext = createContext({});

export const QueryProvider = QueryContext.Provider;

export function useQuery(key, def) {
  const obj = useContext(QueryContext);
  if (!key) return obj;
  return get(obj, key, def || null);
}
