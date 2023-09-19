import { Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEventGroup } from 'generated/gql/graphql';
import { BaseFieldsConfiguration, injectUpdateFields } from 'src/utils';
import { useQuery } from 'urql';
import { CreateModal, CreateModalProps } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

const EventGroupFormFragment = graphql(`
  fragment EventGroupForm on ClearEventGroup {
    id
    name
    startDate
    endDate
    registrationCutoff
    ticketPrice
    earlyBirdCutoff
    earlyBirdPrice
    groupPrice
    showcaseId
  }
`);
const createGroup = graphql(`
  mutation CreateEventGroup($data: ClearEventGroupCreateInput!) {
    clear {
      createEventGroup(data: $data) {
        ...EventGroupForm
      }
    }
  }
`);

const createQuery = graphql(`
  query DataForCreateEventGroup {
    cms {
      events(where: { program: { webname: "codeday" } }, order: startsAt_DESC) {
        items {
          id
          title
        }
      }
    }
  }
`);

const updateEventGroupMutation = graphql(`
  mutation UpdateEventGroup($where: ClearEventGroupWhereUniqueInput!, $data: ClearEventGroupUpdateInput!) {
    clear {
      updateEventGroup(where: $where, data: $data) {
        ...EventGroupForm
      }
    }
  }
`);

const deleteEventGroupMutation = graphql(`
  mutation DeleteEventGroup($where: ClearEventGroupWhereUniqueInput!) {
    clear {
      deleteEventGroup(where: $where) {
        ...EventGroupForm
      }
    }
  }
`);

const fields: BaseFieldsConfiguration<typeof createGroup> = {
  name: {
    _type: 'string',
    required: true,
    uiSchema: {
      'ui:placeholder': '[Season] [Year]',
      'ui:autocomplete': 'off',
    },
  },
  startDate: {
    _type: 'date-time',
    required: true,
    uiSchema: {
      'ui:help':
        'This (along with the next several values) will be used to autofill default values when creating a new event',
    },
  },
  endDate: {
    _type: 'date-time',
    required: true,
  },
  registrationCutoff: {
    _type: 'date-time',
    required: true,
    uiSchema: {
      'ui:help': 'Usually set to end date',
    },
  },
  ticketPrice: {
    _type: 'number',
    required: true,
    schema: {
      default: 15,
      multipleOf: 0.01,
    },
  },
  earlyBirdCutoff: {
    _type: 'date-time',
    required: true,
    uiSchema: {
      'ui:help': 'Usually set to 1mo before event',
    },
  },
  earlyBirdPrice: {
    _type: 'number',
    required: true,
    schema: {
      default: 7,
      multipleOf: 0.01,
    },
  },
  groupPrice: {
    _type: 'number',
    required: true,
    schema: {
      default: 7,
      multipleOf: 0.01,
    },
    uiSchema: {
      'ui:help': 'How much school groups should pay per ticket',
    },
  },
  showcaseId: {
    _type: 'string',
    required: true,
    uiSchema: {
      'ui:help': 'Most of the time, can be set to the same value as Contentful ID',
    },
  },
};

export function CreateEventGroup() {
  const [{ data }] = useQuery({ query: createQuery });

  return (
    <CreateModal
      mutation={createGroup}
      fields={{
        data: {
          ...fields,
          contentfulId: {
            _type: 'string',
            required: true,
            schema: {
              description: 'A contentful `Event`',
              enum: data?.cms?.events?.items.map((e) => e?.id as string),
            },
          },
        },
      }}
    />
  );
}

const updateEventGroupQuery = graphql(`
  query EventGroupForUpdate($where: ClearEventGroupWhereUniqueInput!) {
    clear {
      eventGroup(where: $where) {
        ...EventGroupForm
      }
    }
  }
`);

export type UpdateEventGroupProps = {
  eventGroup: PropFor<ClearEventGroup>;
} & Omit<UpdateModalProps<typeof updateEventGroupMutation>, 'mutation' | 'fields'>;

export function UpdateEventGroup({ eventGroup: eventGroupData, ...props }: UpdateEventGroupProps) {
  const [{ data }] = useQuery({ query: updateEventGroupQuery, variables: { where: { id: eventGroupData.id } } });
  const eventGroup = data?.clear?.eventGroup;
  if (!eventGroup) return <Spinner />;

  return (
    <UpdateModal
      {...props}
      mutation={updateEventGroupMutation}
      fields={{
        where: {
          id: {
            _type: 'string',
            schema: {
              default: eventGroup.id,
              writeOnly: true,
            },
            uiSchema: {
              'ui:widget': 'hidden',
            },
          },
        },
        data: {
          ...injectUpdateFields(fields, eventGroup),
        },
      }}
    />
  );
}

export type DeleteEventGroupProps = {
  eventGroup: PropFor<ClearEventGroup>
} & Omit<DeleteModalProps<typeof deleteEventGroupMutation>, 'mutation' | 'where'>

export function DeleteEventGroup({ eventGroup, ...props }: DeleteEventGroupProps) {
  return (
    <DeleteModal mutation={deleteEventGroupMutation} where={{ id: eventGroup.id }} { ...props }/>
  )
};