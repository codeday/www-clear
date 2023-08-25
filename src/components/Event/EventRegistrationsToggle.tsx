import React, { useState } from 'react';
import { Box, Switch, Text, Checkbox, Stack, Tooltip, Divider, Skeleton } from '@codeday/topo/Atom';
import { UiInfo } from '@codeday/topocons';
import { useToasts } from '@codeday/topo/utils';
import { getFragmentData, graphql } from 'generated/gql';
import { ResultOf } from '@graphql-typed-document-node/core';
import { useMutation, useQuery } from 'urql';
import { allDefined } from 'src/utils';
import { InfoBox, InfoBoxProps } from '../InfoBox';

export const EventRegistrationsToggleFragment = graphql(`
  fragment EventRegistrationsToggle on ClearEvent {
    id
    registrationsOpen
    venue {
      id
      capacity
      contactName
      contactEmail
      contactPhone
      address
      mapLink
    }
    eventRestrictions {
      id
    }
    schedule {
      id
      finalized
    }
    sponsors {
      id
    }
    promoCodes {
      id
    }
    soldTickets
    soldTicketsStudents: soldTickets(onlyStudents: true)
    region {
      countryName
    }
  }
`);

const query = graphql(`
  query EventRegistrationsToggle($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        ...EventRegistrationsToggle
      }
    }
  }
`);

const mutation = graphql(`
  mutation RegistrationsToggle($eventWhere: ClearEventWhereUniqueInput!, $data: Boolean!) {
    clear {
      updateEvent(where: $eventWhere, data: { registrationsOpen: { set: $data } }) {
        id
      }
    }
  }
`);

interface Item {
  name: string;
  check: boolean;
  hide?: boolean;
  checklist?: Item[];
  description?: string;
  requiredToOpen?: boolean;
}

type CheckListItemProps = {
  item: Item;
  nested?: boolean;
};

function CheckListItem({ item, nested = false }: CheckListItemProps) {
  if (item.hide) return <></>;

  if (!item.checklist || !item.check || !item.checklist.map((c) => c.check).includes(false)) {
    return (
      <Checkbox colorScheme="red" size={nested ? 'md' : 'lg'} isFocusable={false} isReadOnly isChecked={item.check}>
        <Tooltip label={item.description}>
          <Box>
            {item.name} {item.description ? <UiInfo /> : null}
          </Box>
        </Tooltip>
      </Checkbox>
    );
  }
  return (
    <>
      <Checkbox colorScheme="red" size={nested ? 'md' : 'lg'} isFocusable={false} isReadOnly isIndeterminate>
        {item.name}
      </Checkbox>
      <Stack pl={6} spacing={0}>
        {item.checklist.map((i) => (
          <CheckListItem item={i} nested />
        ))}
      </Stack>
    </>
  );
}

export type EventRegistrationsToggleProps = {
  event: PartialExcept<ResultOf<typeof EventRegistrationsToggleFragment>, 'id'>;
} & InfoBoxProps;

export function EventRegistrationsToggle({ event: eventData, ...props }: EventRegistrationsToggleProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: eventData.id } } });
  const [_, registrationsToggleMutation] = useMutation(mutation);
  const { success, error } = useToasts();
  const event = getFragmentData(EventRegistrationsToggleFragment, data?.clear?.event) || eventData;
  
  // TODO: allow for this to be configurable per event
  const checklist = [
    {
      name: 'Find a venue',
      check: Boolean(event.venue),
      requiredToOpen: true,
      checklist: [
        {
          name: 'Enter Address',
          check: Boolean(event.venue?.address),
        },
        {
          name: 'Enter Capacity',
          check: Boolean((event.venue?.capacity || 0) > 0),
        },
        {
          name: 'Enter Contact Details',
          check: Boolean(event.venue?.contactName && (event.venue.contactEmail || event.venue.contactPhone)),
        },
        {
          name: 'Enter Map Link',
          check: Boolean(event.venue?.mapLink),
        },
      ],
    },
    {
      name: 'Configure event restrictions',
      hide: Boolean(!event.venue),
      check: Boolean((event.eventRestrictions?.length || 0) > 0),
    },
    {
      name: 'Create initial schedule',
      hide: Boolean(!event.venue),
      description:
        'This does not have to be the entire final schedule for your event! However, at a minimum, publish events for the start, end, and meals.',
      check: Boolean(
        (event.schedule || []).filter((item) => {
          return item.finalized;
        }).length > 0,
      ),
    },
    {
      name: 'Open Registrations',
      check: Boolean(event.registrationsOpen),
    },
    {
      name: 'Promote Event',
      check: Boolean(event.registrationsOpen),
      checklist: [
        {
          name: 'Create a promo code',
          description: [
            'Very few CodeDay attendees end up paying full price, and this is 100% intended!',
            'We recommend creating different promo codes for different schools/groups/etc you reach out to,',
            'this helps them feel special, as well as helps you track the most effective outreach methods!',
          ].join(' '),
          check: Boolean((event.promoCodes || []).length > 0),
        },
        {
          name: 'Your first registration!',
          check: Boolean((event.soldTicketsStudents || 0) > 0),
        },
        {
          name: '50% of capacity sold out!',
          check: Boolean((event.soldTicketsStudents || 0) > (event.venue?.capacity || 0) / 2),
        },
        {
          name: '100% of capacity sold out - wow!',
          check: Boolean((event.soldTickets || -1) >= (event.venue?.capacity || 0)),
        },
      ],
    },
  ];
  const disabled = Boolean(
    checklist
      .filter((c) => c.requiredToOpen)
      .map((c) => c.check)
      .includes(false),
  );
  const [loading, setLoading] = useState(false);

  return (
    <InfoBox heading="Event Status" headingSize="xl" {...props}>
      <Skeleton isLoaded={allDefined(event.soldTickets, event.venue?.capacity || event.venue, event.registrationsOpen)}>
        <Box fontSize="2xl" fontWeight="bold">
          <Text as="span">Registrations are&nbsp;</Text>
          {(event.soldTickets || -1) >= (event.venue?.capacity || 0) ? (
            <Text as="span" color="red.500">
              sold out.
            </Text>
          ) : event.registrationsOpen ? (
            <Text as="span" color="green">
              open.
            </Text>
          ) : (
            <Text as="span" color="gray.500">
              closed.
            </Text>
          )}
        </Box>
        <Switch
          m={2}
          isChecked={event.registrationsOpen}
          isDisabled={(disabled && !event.registrationsOpen) || loading}
          size="lg"
          colorScheme="green"
          onChange={async (e) => {
            setLoading(true);
            await registrationsToggleMutation({
              eventWhere: { id: event.id },
              data: e.target.checked,
            }).then((result) => {
              if (result.error) {
                error(result.error.name, result.error.message);
              } else {
                success(`Registrations ${e.target.checked ? 'opened' : 'closed'}`);
              }
              setLoading(false);
            });
          }}
        />
        {event.registrationsOpen && (
          <Text fontSize="sm">
            WARNING: Closing registrations will show the event as canceled. Registrations close as sold-out
            automatically when the venue capacity is reached.
          </Text>
        )}
      </Skeleton>
      <Divider my={3} />
      {checklist.map((item) => (
        <CheckListItem item={item} />
      ))}
    </InfoBox>
  );
}
