import { Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEvent, ClearSponsor } from 'generated/gql/graphql';
import { BaseFieldsConfiguration, injectUpdateFields } from 'src/utils';
import { useQuery } from 'urql';
import { CreateModal, CreateModalProps } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

const sponsorFormFragment = graphql(`
  fragment SponsorForm on ClearSponsor {
    id
    name
    link
    description
    amount
    perks
    contactName
    contactPhone
    contactEmail
    event {
      sponsors {
        id
      }
    }
  }
`);

const createSponsorMutation = graphql(`
  mutation CreateSponsor($data: ClearSponsorCreateInput!) {
    clear {
      createSponsor(data: $data) {
        ...SponsorForm
      }
    }
  }
`);

const fields: BaseFieldsConfiguration<typeof createSponsorMutation> = {
  name: {
    _type: 'string',
    required: true,
  },
  link: {
    _type: 'string',
  },
  description: {
    _type: 'string',
    uiSchema: {
      'ui:help':
        '**WILL BE DISPLAYED TO PUBLIC** \n' +
        'A short blurb describing the company (can be taken from their website/google)',
    },
  },
  amount: {
    _type: 'number',
    schema: {
      multipleOf: 1,
    },
    uiSchema: {
      'ui:help': 'If sponsorship was not cash (for example food) enter a rough estimate of the goods provided',
    },
  },
  perks: {
    _type: 'string',
    uiSchema: {
      'ui:help': 'Is the company providing something to CodeDay attendees?',
    },
  },
  contactName: {
    _type: 'string',
  },
  contactPhone: {
    _type: 'string',
  },
  contactEmail: {
    _type: 'string',
  },
};

export type CreateSponsorProps = {
  event: PropFor<ClearEvent>;
} & Omit<CreateModalProps<typeof createSponsorMutation>, 'mutation' | 'fields'>;

export function CreateSponsor({ event, ...props }: CreateSponsorProps) {
  return (
    <CreateModal
      {...props}
      mutation={createSponsorMutation}
      headingProps={{ mb: -12 }}
      fields={{
        data: {
          ...fields,
          event: {
            _type: 'connect',
            connect: {
              id: event.id,
            },
          },
        },
      }}
    />
  );
}

const updateSponsorMutation = graphql(`
  mutation UpdateSponsor($where: ClearSponsorWhereUniqueInput!, $data: ClearSponsorUpdateInput!) {
    clear {
      updateSponsor(data: $data, where: $where) {
        ...SponsorForm
      }
    }
  }
`);

const updateSponsorQuery = graphql(`
  query SponsorForUpdate($where: ClearSponsorWhereUniqueInput!) {
    clear {
      sponsor(where: $where) {
        ...SponsorForm
      }
    }
  }
`);

export type UpdateSponsorProps = {
  sponsor: PropFor<ClearSponsor>;
} & Omit<UpdateModalProps<typeof updateSponsorMutation>, 'mutation' | 'fields'>;

export function UpdateSponsor({ sponsor: sponsorData, ...props }: UpdateSponsorProps) {
  const [{ data }] = useQuery({ query: updateSponsorQuery, variables: { where: { id: sponsorData.id } } });
  const sponsor = data?.clear?.sponsor;
  if (!sponsor) return <Spinner />;

  return (
    <UpdateModal
      {...props}
      mutation={updateSponsorMutation}
      fields={{
        where: {
          id: {
            _type: 'string',
            schema: {
              default: sponsor.id,
              writeOnly: true,
            },
            uiSchema: {
              'ui:widget': 'hidden',
            },
          },
        },
        data: {
          // @ts-ignore FIXME
          ...injectUpdateFields(fields, sponsor),
        },
      }}
    />
  );
}

const deleteSponsorMutation = graphql(`
  mutation DeleteSponsor($where: ClearSponsorWhereUniqueInput!) {
    clear {
      deleteSponsor(where: $where) {
        id
      }
    }
  }
`);

export type DeleteSponsorProps = {
  sponsor: PropFor<ClearSponsor>;
} & Omit<DeleteModalProps<typeof deleteSponsorMutation>, 'mutation' | 'where'>;

export function DeleteSponsor({ sponsor, ...props }: DeleteSponsorProps) {
  return <DeleteModal mutation={deleteSponsorMutation} where={{ id: sponsor.id }} {...props} />;
}
