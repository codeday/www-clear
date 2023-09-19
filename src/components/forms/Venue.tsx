import { Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEvent, ClearVenue } from 'generated/gql/graphql';
import { BaseFieldsConfiguration, injectUpdateFields } from 'src/utils';
import { useQuery } from 'urql';
import { CreateModal, CreateModalProps } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

const venueFormFragment = graphql(`
  fragment VenueForm on ClearVenue {
    id
    name
    capacity
    addressLine1
    addressLine2
    addressLine3
    city
    state
    stateAbbreviation
    zipCode
    country
    countryAbbreviation
    mapLink
    contactName
    contactEmail
    contactPhone
  }
`);

export const createVenueMutation = graphql(`
  mutation CreateVenue($data: ClearVenueCreateInput!) {
    clear {
      createVenue(data: $data) {
        ...VenueForm
      }
    }
  }
`);

const fields: BaseFieldsConfiguration<typeof createVenueMutation> = {
  name: {
    _type: 'string',
    required: true,
  },
  capacity: {
    _type: 'number',
    required: true,
  },
  addressLine1: {
    _type: 'string',
  },
  addressLine2: {
    _type: 'string',
  },
  addressLine3: {
    _type: 'string',
  },
  city: {
    _type: 'string',
  },
  state: {
    _type: 'string',
  },
  stateAbbreviation: {
    _type: 'string',
  },
  zipCode: {
    _type: 'string',
  },
  country: {
    _type: 'string',
  },
  countryAbbreviation: {
    _type: 'string',
  },
  mapLink: {
    _type: 'string',
  },
  contactName: {
    _type: 'string',
  },
  contactEmail: {
    _type: 'string',
  },
  contactPhone: {
    _type: 'string',
  },
};

export type CreateVenueProps = {
  event: PropFor<ClearEvent>;
} & Omit<CreateModalProps<typeof createVenueMutation>, 'fields' | 'mutation'>;

export function CreateVenue({ event, ...props }: CreateVenueProps) {
  return (
    <CreateModal
      mutation={createVenueMutation}
      fields={{
        data: {
          ...fields,
          events: {
            _type: 'connect',
            connect: {
              id: event.id,
            },
          },
        },
      }}
      {...props}
    />
  );
}

const updateVenueMutation = graphql(`
  mutation UpdateVenue($data: ClearVenueUpdateInput!, $where: ClearVenueWhereUniqueInput!) {
    clear {
      updateVenue(data: $data, where: $where) {
        ...VenueForm
      }
    }
  }
`);

const updateVenueQuery = graphql(`
  query VenueForUpdate($where: ClearVenueWhereUniqueInput!) {
    clear {
      venue(where: $where) {
        ...VenueForm
      }
    }
  }
`);

export type UpdateVenueProps = {
  venue: PropFor<ClearVenue>;
} & Omit<UpdateModalProps<typeof updateVenueMutation>, 'fields' | 'mutation'>;
export function UpdateVenue({ venue: venueData, ...props }: UpdateVenueProps) {
  const [{ data }] = useQuery({ query: updateVenueQuery, variables: { where: { id: venueData.id } } });
  const venue = data?.clear?.venue;
  if (!venue) return <Spinner />;
  return (
    <UpdateModal
    {...props}
      mutation={updateVenueMutation}
      fields={{
        where: {
          id: {
            _type: 'string',
            schema: {
              default: venue.id,
              writeOnly: true,
            },
            uiSchema: {
              'ui:widget': 'hidden',
            },
          },
        },
        data: {
          // @ts-ignore FIXME
          ...injectUpdateFields(fields, venue),
        },
      }}
    />
  );
}

const deleteVenueMutation = graphql(`
  mutation DeleteVenue($where: ClearVenueWhereUniqueInput!) {
    clear {
      deleteVenue(where: $where) {
        ...VenueForm
      }
    }
  }
`);

export type DeleteVenueProps = {
  venue: PropFor<ClearVenue>;
} & Omit<DeleteModalProps<typeof deleteVenueMutation>, 'where' | 'mutation'>;

export function DeleteVenue({ venue, ...props }: DeleteVenueProps) {
  return <DeleteModal { ...props } where={{ id: venue.id }} mutation={deleteVenueMutation} />;
}
