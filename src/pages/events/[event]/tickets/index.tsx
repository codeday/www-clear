import React, { useState, useEffect } from 'react';
import { Button, Skeleton, Grid, Heading, Text, Select, HStack, Switch, Spinner } from '@codeday/topo/Atom';

import { UiDownload, Camera } from '@codeday/topocons';
import { useRouter } from 'next/router';
import { Icon } from '@chakra-ui/react';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import NotFound from 'src/pages/404';
import { CSVExport } from 'src/components/CSVExport';
import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';
import { client } from 'src/urqlclient';
import { useToasts } from '@codeday/topo/utils';
import { ClearSortOrder, ClearTicketType } from 'generated/gql/graphql';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { TicketBox } from '../../../../components/Ticket';
import { Page } from '../../../../components/Page';
import { CreateTicket } from '../../../../components/forms/Ticket';
import { EventCheckinCounter } from '../../../../components/Event';

const query = graphql(`
  query EventTicketsPage(
    $where: ClearEventWhereUniqueInput!
    $ticketsWhere: ClearTicketWhereInput
    $ticketsOrderBy: [ClearTicketOrderByWithRelationInput!]
  ) {
    clear {
      event(where: $where) {
        id
        name
        tickets(where: $ticketsWhere, orderBy: $ticketsOrderBy) {
          id
          firstName
          lastName
          createdAt
          age
          email
          phone
          type
          whatsApp
          waiverSigned
          checkedIn
          checkedOut
          waiverUrl
          guardian {
            id
            firstName
            lastName
            email
            phone
            whatsApp
          }
          organization: getMetadata(key: "organization")
          surveyResponses
        }
      }
    }
  }
`);

// This is separate because it is a resource-intensive query to clear-gql
const getWaiverBook = graphql(`
  query EventWaiverBook($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        waiverBook
      }
    }
  }
`);

// TODO: Break SortAndFilter into generic component
type SortAndFilterProps<
  O = VariablesOf<typeof query>['ticketsOrderBy'],
  W = VariablesOf<typeof query>['ticketsWhere'],
> = {
  ticketsOrderBy: O;
  setTicketsOrderBy: React.Dispatch<React.SetStateAction<O>>;
  ticketsWhere: W;
  setTicketsWhere: React.Dispatch<React.SetStateAction<W>>;
};

function SortAndFilter({ ticketsOrderBy, setTicketsOrderBy, ticketsWhere, setTicketsWhere }: SortAndFilterProps) {
  const sortOptions: { [key: string]: typeof ticketsOrderBy } = {
    'alphabetical, last name': {
      lastName: ClearSortOrder.desc,
    },
    'alphabetical, first name': {
      firstName: ClearSortOrder.desc,
    },
    'age high-low': {
      age: ClearSortOrder.desc,
    },
    'age low-high': {
      age: ClearSortOrder.asc,
    },
    'signup date newest-oldest': {
      createdAt: ClearSortOrder.desc,
    },
    'signup date oldest-newest': {
      createdAt: ClearSortOrder.asc,
    },
  };

  const whereOptions: { [key: string]: typeof ticketsWhere } = {
    all: {},
    student: {
      type: { equals: ClearTicketType.STUDENT },
    },
    staff: {
      type: { not: { equals: ClearTicketType.STUDENT } },
    },
    'waiver signed': {
      waiverSigned: {
        equals: true,
      },
    },
    'waiver unsigned': {
      waiverSigned: {
        equals: false,
      },
    },
    'checked in': {
      checkedIn: {
        not: null,
      },
      checkedOut: null,
    },
    'not checked in': {
      OR: [
        {
          checkedIn: null,
          checkedOut: null,
        },
        {
          checkedIn: {
            not: null,
          },
          checkedOut: {
            not: null,
          },
        },
      ],
    },
  };
  return (
    <HStack mt={4} w="100%" spacing={5}>
      <HStack>
        <Text w="fit-content">{'Sort: '}</Text>
        <Select
          width="fit-content"
          value={JSON.stringify(ticketsOrderBy)}
          onChange={(e) => {
            setTicketsOrderBy(JSON.parse(e.target.value));
          }}
        >
          {Object.keys(sortOptions).map((option) => (
            <option value={JSON.stringify(sortOptions[option])}>{option}</option>
          ))}
        </Select>
      </HStack>
      <HStack>
        <Text w="fit-content">{'Filter: '}</Text>
        <Select
          width="fit-content"
          value={JSON.stringify(ticketsWhere)}
          onChange={(e) => {
            setTicketsWhere(JSON.parse(e.target.value));
          }}
        >
          {Object.keys(whereOptions).map((option) => (
            <option value={JSON.stringify(whereOptions[option])}>{option}</option>
          ))}
        </Select>
      </HStack>
      {/* <HStack>
        <Text w="fit-content">{'Filter By: '}</Text>
        <Select
          width="fit-content"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        >
          <option value="all">all</option>
          <option value="student">student</option>
          <option value="staff">staff</option>
          <option value="waiver">waiver</option>
          <option value="checked-in">checked in</option>
        </Select>
        {filter === 'waiver' && (
          <>
            <Text>Missing Waiver? </Text>
            <Switch
              isChecked={waiver}
              onChange={() => {
                setWaiver(!waiver);
              }}
            />
          </>
        )}
        {filter === 'checked-in' && (
          <>
            <Text>Checked In? </Text>
            <Switch
              isChecked={checkedIn}
              onChange={() => {
                setCheckedIn(!checkedIn);
              }}
            />
          </>
        )}
      </HStack> */}
    </HStack>
  );
}

// TODO: Make this more readable
export default function Tickets() {
  const router = useRouter();
  const [ticketsOrderBy, setTicketsOrderBy] = useState<VariablesOf<typeof query>['ticketsOrderBy']>({
    lastName: ClearSortOrder.asc,
  });
  const [ticketsWhere, setTicketsWhere] = useState<VariablesOf<typeof query>['ticketsWhere']>({});
  const [{ data, fetching, stale }, refreshTickets] = useQuery({
    query,
    variables: { where: { id: router.query.event as string }, ticketsOrderBy, ticketsWhere },
    requestPolicy: 'cache-and-network',
  });
  const [waiversLoading, setWaiversLoading] = useState(false);
  const [waiverBookUrl, setWaiverBookUrl] = useState<string>();
  const { error } = useToasts();
  const event = data?.clear?.event;

  if (event === null && !fetching && !stale) {
    return <NotFound />;
  }
  if (!event) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  const surveyHeaders: string[] = Array.from(
    new Set(event.tickets.flatMap((t) => Object.keys(t.surveyResponses || {})).filter((t) => !t.startsWith('study.'))),
  );
  const headers = [
    'firstName',
    'lastName',
    'age',
    'email',
    'phone',
    'whatsApp',
    'type',
    'guardianFirstName',
    'guardianLastName',
    'guardianEmail',
    'guardianPhone',
    'guardianWhatsApp',
    'waiverSigned',
    'waiverUrl',
    'organization',
    ...surveyHeaders,
  ];
  const csv = event.tickets
    .map((t) =>
      [
        t.firstName,
        t.lastName,
        t.age,
        t.email,
        t.phone,
        t.whatsApp,
        t.type,
        t.guardian?.firstName || '',
        t.guardian?.lastName || '',
        t.guardian?.email || '',
        t.guardian?.phone || '',
        t.guardian?.whatsApp || '',
        t.waiverSigned ? 'signed' : 'not signed',
        t.waiverUrl,
        t.organization || '',

        ...surveyHeaders.map((h) => t.surveyResponses?.[h] || '').map((s) => (s as string).replace(/,/g, ';')),
      ].join(','),
    )
    .join(`\n`);
  return (
    <Page title={`${event.name} Tickets`}>
      <Breadcrumbs event={event} />
      <Heading>{event.name} Tickets</Heading>
      <CreateTicket event={event} onSubmit={refreshTickets} />
      <CSVExport display="inline" m={1} data={csv} headers={headers} filename="tickets.csv" />
      <Button
      m={1}
        isLoading={waiversLoading}
        onClick={async () => {
          if (waiverBookUrl) {
            window.open(waiverBookUrl);
            return;
          }
          setWaiversLoading(true);
          const resp = await client.query(getWaiverBook, { where: { id: event.id } }).toPromise();
          if (resp.error) {
            error(resp.error.name, resp.error.message);
          } else {
            setWaiverBookUrl(resp.data?.clear?.event?.waiverBook);
            window.open(resp.data?.clear?.event?.waiverBook);
          }
          setWaiversLoading(false);
        }}
      >
        <Icon mr={2} as={UiDownload} />
        Download All Waivers
      </Button>
      <Button m={1} onClick={() => router.push({ pathname: 'tickets/scan/', query: { event: event.id } })}>
        <Icon mr={2} as={Camera} />
        Scan Tickets
      </Button>
      <EventCheckinCounter event={event} borderWidth={1} mt={4} p={4} />
      <SortAndFilter
        setTicketsOrderBy={setTicketsOrderBy}
        setTicketsWhere={setTicketsWhere}
        ticketsOrderBy={ticketsOrderBy}
        ticketsWhere={ticketsWhere}
      />

      <HStack spacing={4}>
        <Text>
          Avg Student Age:&nbsp;
          {Math.round(
            (event.tickets
              .filter((ticket) => ticket.type === 'STUDENT' && ticket.age)
              .reduce((partialSum, ticket) => partialSum + (ticket.age as number), 0) /
              event.tickets.filter((ticket) => ticket.type === 'STUDENT' && ticket.age).length) *
              10,
          ) / 10}
        </Text>
        <Text>Total Tickets:&nbsp;{event.tickets.length}</Text>
        <Text>
          Students:&nbsp;
          {event.tickets.filter((ticket) => ticket.type === 'STUDENT').length}
        </Text>
        <Text>
          Staff:&nbsp;
          {event.tickets.filter((ticket) => ticket.type !== 'STUDENT').length}
        </Text>
      </HStack>
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
      >
        {event.tickets.map((ticket) => (
          <Skeleton isLoaded={!fetching && !stale} m={2} rounded={3}>
            <TicketBox ticket={ticket} m={0} />
          </Skeleton>
        ))}
      </Grid>
    </Page>
  );
}
