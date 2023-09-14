import { Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEvent, ClearTicket, ClearTicketType } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import { CreateModal, CreateModalProps } from '../CRUD/create';
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

export type CreateTicketProps = {
  event: PropFor<ClearEvent>;
} & Omit<CreateModalProps<typeof createTicketMutation>, 'fields' | 'mutation'>;

export function CreateTicket({ event }: CreateTicketProps) {
  return (
    <CreateModal
      headingProps={{ mb: -12 }}
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
          },
          username: {
            _type: 'string',
            uiSchema: {
              'ui:help':
                'Username from account.codeday.org. RECOMMENDED FOR STAFF as this affects how you are displayed to the public on event pages.',
            },
          },
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
          firstName: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: ticket.firstName,
              },
            },
          },
          lastName: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: ticket.lastName,
              },
            },
          },
          age: {
            _type: 'update',
            set: {
              _type: 'number',
              schema: {
                default: ticket.age,
              },
            },
          },
          email: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: ticket.email,
              },
            },
          },
          phone: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: ticket.phone,
              },
            },
          },
          whatsApp: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: ticket.whatsApp,
              },
            },
          },
          type: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: ticket.type,
                enum: Object.keys(ClearTicketType)
              },
            },
          },
          username: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: ticket.username,
              },
              uiSchema: {
                'ui:help':
                  'Username from account.codeday.org. RECOMMENDED FOR STAFF as this affects how you are displayed to the public on event pages.',
              },
            },
          },
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
