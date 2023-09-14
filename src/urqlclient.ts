import { Client, fetchExchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';
import { getSession } from 'next-auth/react';
import introspectedSchema from 'generated/gql/urql-introspection.json';
import { cacheExchange } from '@urql/exchange-graphcache';
import { DateTime } from 'luxon';
import customScalarsExchange from 'urql-custom-scalars-exchange';
import { IntrospectionQuery } from 'graphql';
import { devtoolsExchange } from '@urql/devtools';
import {
  ClearEventWhereUniqueInput,
  ClearMutationcreateTicketArgs,
  ClearMutationupdateTicketArgs,
  ClearQueryeventArgs,
  ClearQueryticketArgs,
  ClearQueryticketsArgs,
  ClearTicketWhereInput,
  CreateTicketMutation,
} from 'generated/gql/graphql';

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
const cacheEx = cacheExchange({
  schema: introspectedSchema,
  resolvers: {
    ClearQuery: {
      // these should work, but dont for some reason
      // event: (_, args: ClearQueryeventArgs) => ({ __typename: 'ClearEvent', id: args.where.id }),
      // ticket: (_, args: ClearQueryticketArgs) => ({ __typename: 'ClearTicket', id: args.where.id }),
    },
  },
  updates: {
    ClearMutation: {
      createTicket(result: CreateTicketMutation, args: ClearMutationcreateTicketArgs, cache, _info) {
        const tickets = cache.resolve('ClearQuery', 'tickets');
        if (!result.clear?.createTicket) return; // this should be fine as if the query errored we dont need to change cache
        // we could support this, but it would be extra effort for an uncommon mutation
        if (!args.data.event.connect?.id) {
          throw new Error('createTicket mutations without `connect` are not supported by cache');
        }
        const eventId = args.data.event.connect.id;
        if (Array.isArray(tickets)) {
          tickets.push({ __typename: 'ClearTicket', id: result.clear.createTicket.id });
          // @ts-ignore
          cache.link('ClearQuery', 'tickets', tickets);
        }
        const eventTickets = cache.resolve({ __typename: 'ClearEvent', id: eventId }, 'tickets');
        if (Array.isArray(eventTickets)) {
          eventTickets.push({ __typename: 'ClearTicket', id: result.clear.createTicket.id });
          cache.link({ __typename: 'ClearEvent', id: eventId }, 'tickets', eventTickets);
        }
        // FIXME: This isn't great and might cause some weird bugs. The best way to do solve this would be to create a comprehensive
        // ClearEvent.tickets resolver, but that would be a lot of work to do manually and I don't have the time to figure out
        // how to do it automatically (which i think should be possible)
        cache.inspectFields({ __typename: 'ClearEvent', id: eventId }).forEach((field) => {
          if (field.fieldName === 'tickets' && field.arguments) {
            cache.invalidate({ __typename: 'ClearEvent', id: eventId }, field.fieldName, field.arguments);
          }
        });
      },
    },
  },
  keys: {
    ClearQuery: () => null,
    CmsAsset: () => null,
    CmsRegion: (data) => data.webname as string,
  },
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
  exchanges: [scalarsExchange, cacheEx, auth, fetchExchange],
});
