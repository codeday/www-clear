import { Spinner } from '@codeday/topo/Atom';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { graphql } from 'generated/gql';
import { ClearEvent, ClearTicket, ClearTicketType } from 'generated/gql/graphql';
import { BaseFieldsConfiguration, injectUpdateFields } from 'src/utils';
import { useQuery } from 'urql';
import { CreateModal, CreateModalProps, FieldsConfiguration } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

const createTicketMutation = graphql(`
  mutation CreateTicket($data: ClearTicketCreateInput!) {
    clear {
      createTicket(data: $data) {
        id
        event {
          id
        }
      }
    }
  }
`);

// @ts-ignore FIXME
const fields: BaseFieldsConfiguration<typeof createTicketMutation> = {
  firstName: {
    _type: 'string',
    required: true,
  },
  lastName: {
    _type: 'string',
    required: true,
  },
  age: {
    _type: 'number',
  },
  email: {
    _type: 'string',
  },
  phone: {
    _type: 'string',
  },
  whatsApp: {
    _type: 'string',
  },
  type: {
    _type: 'string',
    schema: {
      enum: Object.keys(ClearTicketType),
    },
  },
  username: {
    _type: 'string',
    uiSchema: {
      'ui:help':
        'Username from account.codeday.org. RECOMMENDED FOR STAFF as this affects how you are displayed to the public on event pages.',
    },
  },
};

export type CreateTicketProps = {
  event: PropFor<ClearEvent>;
} & Omit<CreateModalProps<typeof createTicketMutation>, 'fields' | 'mutation'>;

export function CreateTicket({ event, ...props }: CreateTicketProps) {
  return (
    <CreateModal
      headingProps={{ mb: -12 }}
      {...props}
      mutation={createTicketMutation}
      fields={{
        data: {
          event: {
            _type: 'connect',
            required: true,
            connect: {
              id: event.id,
            },
          },
          ...fields,
        },
      }}
    />
  );
}

const updateTicketMutation = graphql(`
  mutation UpdateTicket($where: ClearTicketWhereUniqueInput!, $data: ClearTicketUpdateInput!) {
    clear {
      updateTicket(data: $data, where: $where) {
        id
        firstName
        lastName
        age
        type
        email
        phone
        whatsApp
        username
      }
    }
  }
`);

const updateTicketQuery = graphql(`
  query TicketForUpdate($where: ClearTicketWhereUniqueInput!) {
    clear {
      ticket(where: $where) {
        id
        firstName
        lastName
        age
        type
        email
        phone
        whatsApp
        username
      }
    }
  }
`);

export type UpdateTicketProps = {
  ticket: PropFor<ClearTicket>;
} & Omit<UpdateModalProps<typeof updateTicketMutation>, 'mutation' | 'fields'>;

export function UpdateTicket({ ticket: ticketData, ...props }: UpdateTicketProps) {
  const [{ data }] = useQuery({ query: updateTicketQuery, variables: { where: { id: ticketData.id } } });
  const ticket = data?.clear?.ticket;
  if (!ticket) return <Spinner />;
  return (
    <UpdateModal
      mutation={updateTicketMutation}
      fields={{
        data: {
          ...injectUpdateFields(fields, ticket),
        },
        where: {
          id: {
            _type: 'string',
            title: '',
            schema: {
              default: ticket.id,
              writeOnly: true,
            },
            uiSchema: {
              'ui:widget': 'hidden',
            },
          },
        },
      }}
      {...props}
    />
  );
}

const deleteTicketMutation = graphql(`
  mutation DeleteTicket($where: ClearTicketWhereUniqueInput!) {
    clear {
      deleteTicket(where: $where) {
        id
      }
    }
  }
`);

export type DeleteTicketProps = {
  ticket: PropFor<ClearTicket>;
} & Omit<DeleteModalProps<typeof deleteTicketMutation>, 'mutation' | 'where'>;

export function DeleteTicket({ ticket, ...props }: DeleteTicketProps) {
  return <DeleteModal mutation={deleteTicketMutation} where={{ id: ticket.id }} {...props} />;
}
