import { Client, fetchExchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';
import { getSession } from 'next-auth/react';
import introspectedSchema from 'generated/gql/urql-introspection.json';
import { cacheExchange } from '@urql/exchange-graphcache';
import { DateTime } from 'luxon';
import customScalarsExchange from 'urql-custom-scalars-exchange';
import { IntrospectionQuery } from 'graphql';
import { devtoolsExchange } from '@urql/devtools';

const schema = introspectedSchema as unknown as IntrospectionQuery;
const auth = authExchange(async (utils) => {
  const session = await getSession();
  return {
    addAuthToOperation(operation) {
      if (!session || !session.clearAuthToken) return operation;
      return utils.appendHeaders(operation, {
        'X-Clear-Authorization': `Bearer ${session.clearAuthToken}`,
      });
    },
    didAuthError(error) {
      return error.message.startsWith('Access denied!');
    },
    async refreshAuth() {
      // TODO: Implement something here.
      // This likely wont get called though, so it's fine empty for now.
    },
  };
});

// function idFromArgs(args: Variables) {
//   if (args.id) return args.id;
//   if (args.where && typeof args.where !== 'string' && typeof args.where !== 'number') return args.where.id;
// };

// function getUnique(__typename: string): Resolver {
//   return (_, args) => ({ __typename, id: idFromArgs(args) });
// }
// TODO: improve amount of cache hits by adding resolvers, etc
const cache = cacheExchange({
  schema: introspectedSchema,
  // keys: {
  // CmsRegion
  // }
});

const scalarsExchange = customScalarsExchange({
  schema,
  scalars: {
    ClearDateTime(value) {
      return DateTime.fromISO(value);
    },
  },
});

export const client = new Client({
  url: 'https://graph.codeday.org',
  exchanges: [devtoolsExchange, scalarsExchange, cache, auth, fetchExchange],
});
