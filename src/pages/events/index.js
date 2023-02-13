import React, {useRef, useState} from 'react';
import {DateTime} from 'luxon';
import {Box, Grid, Heading, List, ListItem, Text, Spinner} from "@codeday/topo/Atom";
import {Select} from 'chakra-react-select';
import {useHotkeys} from 'react-hotkeys-hook';
import {getSession} from 'next-auth/react';
import Page from '../../components/Page';
import {getFetcher} from '../../fetch';
import Event from '../../components/Event';
import {getEvents} from './index.gql';
import getConfig from "next/config";
import {useRouter} from "next/router";
import Kbd from '../../components/Kbd';

const {serverRuntimeConfig} = getConfig();


export default function Events({ eventGroups, isAdmin }) {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const searchBar = useRef()
  useHotkeys('ctrl+k', () => searchBar.current.focus(), { preventDefault: true } )
  useHotkeys('esc', () => searchBar.current.blur(), { enableOnFormTags: true } )

  if (!eventGroups) return <Page/>;
  if(isLoading) return <Page><Spinner /></Page>
  const now = DateTime.now().minus({ days: 1 });
  const events = []
  eventGroups.forEach(eg => {
    eg.events.forEach(event => {
      events.push({
        label: `${event.name} (${eg.name})`,
        value: event.id,
      })
    })
  })

  return (
    <Page title="Events">
      <Box rounded="md" boxShadow="base" mb={4}>
        <Select
          useBasicStyles
          ref={searchBar}
          boxShadow="base"
          options={events}
          placeholder="Search Events"
          components={{
            DropdownIndicator: () => (<><Kbd>ctrl</Kbd> + <Kbd>K</Kbd></>)
          }}
          onChange={async (e) => {
            setLoading(true)
            await router.push(`events/${e.value}`)
            setLoading(false)
          }}
        />
      </Box>
      {eventGroups.map((eg) => {
        const hasOther = !isAdmin && eg.otherEvents.length > 0;
        if (eg.events.length === 0 && !hasOther) return;
        if (eg.events.length === 0) {
          return (
            <Box mb={12} key={eg.id}>
              <Heading textAlign="center" fontSize="3xl" mb={8}>{eg.name}</Heading>
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
            <Heading textAlign="center" fontSize="3xl" mb={8}>{eg.name}</Heading>
            <Grid templateColumns={{ base: '1fr', lg:  hasOther ? '4fr 1fr' : '1fr' }} gap={8}>
              <Box>
                <Grid
                  templateColumns={{
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: `repeat(${hasOther ? 2 : 3}, 1fr)`
                  }}
                  gap={8}
                >
                  {eg.events.map((event) => (
                    <Event key={event.id} m={0} event={event}/>
                  ))}
                </Grid>
              </Box>
              <Box d={{ base: 'none', lg: hasOther ? 'block' : 'none'}}>
                <Heading as="h3" fontSize="lg" mb={2}>
                  {eg.otherEvents.length} more this season:
                </Heading>
                <List pl={2} styleType="disc" stylePosition="inside">
                  {eg.otherEvents.map((event) => <ListItem key={event.id}>{event.name}</ListItem>)}
                </List>
              </Box>
            </Grid>
          </Box>
        );
      })}
    </Page>
  );
}

export async function getServerSideProps({req, res, query}) {
  const session = await getSession({req});
  const fetch = getFetcher(session);
  if (!session) return {props: {}};
  const eventResults = await fetch(
    getEvents,
    session.isAdmin ? null : { where: [{ managers: { hasSome: [session.user.nickname] } }] }
  );
  return {
    props: {
      eventGroups: eventResults.clear.eventGroups,
      isAdmin: session.isAdmin,
    },
  };
}
