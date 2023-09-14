import { Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearPerson, ClearTicket } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import { CreateModal, CreateModalProps } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

const guardianFragment = graphql(`
  fragment GuardianForm on ClearPerson {
    id
    firstName
    lastName
    email
    phone
    whatsApp
    Ticket {
      id
      guardian {
        id
      }
    }
  }
`);

const createGuardianMutation = graphql(`
  mutation CreateGuardian($data: ClearPersonCreateInput!) {
    clear {
      createPerson(data: $data) {
        ...GuardianForm
      }
    }
  }
`);

export type CreateGuardianProps = {
  ticket: PropFor<ClearTicket>;
} & Omit<CreateModalProps<typeof createGuardianMutation>, 'mutation' | 'fields'>;

export function CreateGuardian({ ticket, ...props }: CreateGuardianProps) {
  return (
    <CreateModal
      mutation={createGuardianMutation}
      fields={{
        data: {
          firstName: {
            _type: 'string',
            required: true,
          },
          lastName: {
            _type: 'string',
            required: true,
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
          Ticket: {
            _type: 'connect',
            connect: {
              id: ticket.id,
            },
          },
        },
      }}
      {...props}
    />
  );
}

const updateGuardianMutation = graphql(`
  mutation UpdateGuardian($where: ClearPersonWhereUniqueInput!, $data: ClearPersonUpdateInput!) {
    clear {
      updatePerson(data: $data, where: $where) {
        ...GuardianForm
      }
    }
  }
`);

const updateGuardianQuery = graphql(`
  query GuardianForUpdate($where: ClearPersonWhereUniqueInput!) {
    clear {
      person(where: $where) {
        ...GuardianForm
      }
    }
  }
`);

export type UpdateGuardianProps = {
  guardian: PropFor<ClearPerson>;
} & Omit<UpdateModalProps<typeof updateGuardianQuery>, 'fields' | 'mutation'>;

export function UpdateGuardian({ guardian: guardianData, ...props }: UpdateGuardianProps) {
  const [{ data }] = useQuery({ query: updateGuardianQuery, variables: { where: { id: guardianData.id } } });
  const guardian = data?.clear?.person;
  if (!guardian) return <Spinner />;
  return (
    <UpdateModal
      mutation={updateGuardianMutation}
      fields={{
        where: {
          id: {
            _type: 'string',
            schema: {
              default: guardian.id,
              writeOnly: true,
            },
            uiSchema: {
              'ui:widget': 'hidden',
            },
          },
        },
        data: {
          firstName: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: guardian.firstName,
              },
            },
          },
          lastName: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: guardian.lastName,
              },
            },
          },
          email: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: guardian.email,
              },
            },
          },
          phone: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: guardian.phone,
              },
            },
          },
          whatsApp: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: guardian.whatsApp,
              },
            },
          },
        },
      }}
      {...props}
    />
  );
}

const deleteGuardianMutation = graphql(`
  mutation DeleteGuardian($where: ClearPersonWhereUniqueInput!) {
    clear {
      deletePerson(where: $where) {
        id
      }
    }
  }
`);

export type DeleteGuardianProps = {
  guardian: PropFor<ClearPerson>;
} & Omit<DeleteModalProps<typeof deleteGuardianMutation>, 'mutation' | 'where'>;

export function DeleteGuardian({ guardian, ...props }: DeleteGuardianProps) {
  return <DeleteModal mutation={deleteGuardianMutation} where={{ id: guardian.id }} {...props} />
}
