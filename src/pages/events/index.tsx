import React, { useRef, useState } from 'react';

import { Box, Grid, Heading, List, ListItem, Text, Spinner } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import { Select } from 'chakra-react-select';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSession } from 'next-auth/react';
import { useQuery } from 'urql';
import { useRouter } from 'next/router';
import { graphql } from 'generated/gql';
import { Page } from '../../components/Page';
import { EventBox, EventSearch } from '../../components/Event';

const query = graphql(`
  query EventsIndex($where: [ClearEventWhereInput!]) {
    clear {
      eventGroups(orderBy: [{ startDate: desc }]) {
        id
        name
        events(orderBy: [{ startDate: asc }], where: { AND: $where }) {
          id
          name
          endDate
          minAge
        }
        otherEvents: events(where: { NOT: $where }) {
          id
          name
        }
      }
    }
  }
`);

export default function Events() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.isAdmin;
  // TODO: use infinite/paginated query instead
  const [{ data }] = useQuery({
    query,
    variables: isAdmin ? {} : { where: [{ managers: { hasSome: [session?.user.nickname || ''] } }] },
  });

  if (!data?.clear || loading) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  const { eventGroups } = data.clear;

  return (
    <Page title="Events">
      <EventSearch events={eventGroups.flatMap((e) => e.events)} />
      {eventGroups.map((eg) => {
        const hasOther = !isAdmin && eg.otherEvents.length > 0;
        if (eg.events.length === 0 && !hasOther) return;
        if (eg.events.length === 0) {
          return (
            <Box mb={12} key={eg.id}>
              <Heading textAlign="center" fontSize="3xl" mb={8}>
                {eg.name}
              </Heading>
              <Box color="gray.500" borderWidth={1} p={8} rounded="sm" textAlign="center">
                <Text mb={4} fontWeight="bold">
                  {eg.otherEvents.length} events (you didn't manage any):
                </Text>
                <Text>{eg.otherEvents.map((e) => e.name).join(', ')}</Text>
              </Box>
            </Box>
          );
        }

        return (
          <Box mb={12} key={eg.id}>
            <Heading textAlign="center" fontSize="3xl" mb={8}>
              {eg.name}
            </Heading>
            <Grid templateColumns={{ base: '1fr', lg: hasOther ? '4fr 1fr' : '1fr' }} gap={8}>
              <Box>
                <Grid
                  templateColumns={{
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: `repeat(${hasOther ? 2 : 3}, 1fr)`,
                  }}
                  gap={8}
                >
                  {eg.events.map((event) => (
                    <EventBox key={event.id} m={0} event={event} />
                  ))}
                </Grid>
              </Box>
              <Box display={{ base: 'none', lg: hasOther ? 'block' : 'none' }}>
                <Heading as="h3" fontSize="lg" mb={2}>
                  {eg.otherEvents.length} more this season:
                </Heading>
                <List pl={2} styleType="disc" stylePosition="inside">
                  {eg.otherEvents.map((event) => (
                    <ListItem key={event.id}>{event.name}</ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Box>
        );
      })}
    </Page>
  );
}
