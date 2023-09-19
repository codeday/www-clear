import { Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEvent, ClearScheduleItem } from 'generated/gql/graphql';
import { BaseFieldsConfiguration, injectUpdateFields } from 'src/utils';
import { useQuery } from 'urql';
import { CreateModal, CreateModalProps } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

const scheduleItemFormFragment = graphql(`
  fragment ScheduleItemForm on ClearScheduleItem {
    id
    name
    type
    description
    link
    start
    end
    hostEmail
    hostName
    hostPronoun
    organizerEmail
    organizerName
    organizerPhone
    finalized
    internal
  }
`);

const createScheduleItemMutation = graphql(`
  mutation CreateScheduleItem($data: ClearScheduleItemCreateInput!) {
    clear {
      createScheduleItem(data: $data) {
        ...ScheduleItemForm
      }
    }
  }
`);

const fields: BaseFieldsConfiguration<typeof createScheduleItemMutation> = {
  name: {
    _type: 'string',
    required: true,
  },
  type: {
    _type: 'string',
    schema: {
      examples: ['Workshop', 'Activity', 'Meal', 'Deadline'],
    },
    uiSchema: {
      'ui:help': 'One word category - also determines color coding',
    },
  },
  description: {
    _type: 'string',
    title: 'Description',
  },
  link: {
    _type: 'string',
    title: 'Link',
  },
  start: {
    _type: 'date-time',
    required: true,
  },
  end: {
    _type: 'date-time',
  },
  hostName: {
    _type: 'string',
  },
  hostPronoun: {
    _type: 'string',
    title: 'Host Pronouns',
  },
  organizerName: {
    _type: 'string',
  },
  organizerEmail: {
    _type: 'string',
  },
  organizerPhone: {
    _type: 'string',
  },
  finalized: {
    _type: 'boolean',
    title: 'Published',
    uiSchema: {
      'ui:help': 'Is this schedule item ready to be displayed on the event website?',
    },
  },
  internal: {
    _type: 'boolean',
    uiSchema: {
      'ui:help':
        'Internal Schedule Items are only shown to volunteers and staff. An internal event must still be marked as "published" to be displayed internally',
    },
  },
};

export type CreateScheduleItemProps = {
  event: PropFor<ClearEvent>;
} & Omit<CreateModalProps<typeof createScheduleItemMutation>, 'fields' | 'mutation'>;

export function CreateScheduleItem({ event, ...props }: CreateScheduleItemProps) {
  return (
    <CreateModal
      {...props}
      mutation={createScheduleItemMutation}
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

const updateScheduleItemMutation = graphql(`
  mutation UpdateScheduleItem($where: ClearScheduleItemWhereUniqueInput!, $data: ClearScheduleItemUpdateInput!) {
    clear {
      updateScheduleItem(where: $where, data: $data) {
        ...ScheduleItemForm
      }
    }
  }
`);

const updateScheduleItemQuery = graphql(`
  query ScheduleItemForUpdate($where: ClearScheduleItemWhereUniqueInput!) {
    clear {
      scheduleItem(where: $where) {
        ...ScheduleItemForm
      }
    }
  }
`);

export type UpdateScheduleItemProps = {
  scheduleItem: PropFor<ClearScheduleItem>;
} & Omit<UpdateModalProps<typeof updateScheduleItemMutation>, 'fields' | 'mutation'>;

export function UpdateScheduleItem({ scheduleItem: scheduleItemData, ...props }: UpdateScheduleItemProps) {
  const [{ data }] = useQuery({ query: updateScheduleItemQuery, variables: { where: { id: scheduleItemData.id } } });
  const scheduleItem = data?.clear?.scheduleItem;
  if (!scheduleItem) return <Spinner />;

  return (
    <UpdateModal
      {...props}
      mutation={updateScheduleItemMutation}
      fields={{
        where: {
          id: {
            _type: 'string',
            schema: {
              default: scheduleItem.id,
              writeOnly: true,
            },
            uiSchema: {
              'ui:widget': 'hidden',
            },
          },
        },
        data: {
          // @ts-expect-error
          ...injectUpdateFields(fields, scheduleItem),
        },
      }}
    />
  );
}

const deleteScheduleItemMutation = graphql(`
  mutation DeleteScheduleItem($where: ClearScheduleItemWhereUniqueInput!) {
    clear {
      deleteScheduleItem(where: $where) {
        ...ScheduleItemForm
      }
    }
  }
`);

export type DeleteScheduleItemProps = {
  scheduleItem: PropFor<ClearScheduleItem>;
} & Omit<DeleteModalProps<typeof deleteScheduleItemMutation>, 'where' | 'mutation'>;

export function DeleteScheduleItem({ scheduleItem, ...props }: DeleteScheduleItemProps) {
  return <DeleteModal mutation={deleteScheduleItemMutation} where={{ id: scheduleItem.id }} {...props} />;
}
