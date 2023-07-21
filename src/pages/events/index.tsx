import React, {useRef, useState} from 'react';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'luxo... Remove this comment to see the full error message
import {DateTime} from 'luxon';
import {Box, Grid, Heading, List, ListItem, Text, Spinner} from "@codeday/topo/Atom";
import {useColorModeValue} from '@codeday/topo/Theme'
import {Select} from 'chakra-react-select';
import {useHotkeys} from 'react-hotkeys-hook';
import {getSession} from 'next-auth/react';
import Page from '../../components/Page';
import {getFetcher} from '../../fetch';
import Event from '../../components/Event';

// @ts-expect-error TS(2307) FIXME: Cannot find module './index.gql' or its correspond... Remove this comment to see the full error message
import {getEvents} from './index.gql';
import getConfig from "next/config";
import {useRouter} from "next/router";
import Kbd from '../../components/Kbd';

const {serverRuntimeConfig} = getConfig();


export default function Events({
  eventGroups,
  isAdmin
}: any) {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const searchBar = useRef()

  // @ts-expect-error TS(2532) FIXME: Object is possibly 'undefined'.
  useHotkeys('ctrl+k', () => searchBar.current.focus(), { preventDefault: true } )

  // @ts-expect-error TS(2532) FIXME: Object is possibly 'undefined'.
  useHotkeys('esc', () => searchBar.current.blur(), { enableOnFormTags: true } )

  if (!eventGroups) return <Page/>;
  if(isLoading) return <Page><Spinner /></Page>
  const now = DateTime.now().minus({ days: 1 });
  const events: any = []
  eventGroups.forEach((eg: any) => {
    eg.events.forEach((event: any) => {
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

          // @ts-expect-error TS(2322) FIXME: Type 'MutableRefObject<undefined>' is not assignab... Remove this comment to see the full error message
          ref={searchBar}
          boxShadow="base"
          options={events}
          placeholder="Search Events"
          chakraStyles={{
            menuList: (provided) => ({
              ...provided,
              background: useColorModeValue('white', 'gray.1100'),
            }),
            option: (provided, state) => ({
              ...provided,
              bg: state.isFocused? useColorModeValue('gray.100', 'gray.800') : useColorModeValue('white', 'gray.1100')
            })
            }
          }
          components={{
            DropdownIndicator: () => (<><Kbd>ctrl</Kbd> + <Kbd>K</Kbd></>)
          }}
          onChange={async (e) => {
            setLoading(true)

            // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
            await router.push(`events/${e.value}`)
            setLoading(false)
          }}
        />
      </Box>
      {eventGroups.map((eg: any) => {
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
                <Text>{eg.otherEvents.map((e: any) => e.name).join(', ')}</Text>
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
                  {eg.events.map((event: any) => <Event key={event.id} m={0} event={event}/>)}
                </Grid>
              </Box>
              <Box display={{ base: 'none', lg: hasOther ? 'block' : 'none'}}>
                <Heading as="h3" fontSize="lg" mb={2}>
                  {eg.otherEvents.length} more this season:
                </Heading>
                <List pl={2} styleType="disc" stylePosition="inside">
                  {eg.otherEvents.map((event: any) => <ListItem key={event.id}>{event.name}</ListItem>)}
                </List>
              </Box>
            </Grid>
          </Box>
        );
      })}
    </Page>
  );
}

export async function getServerSideProps({
  req,
  res,
  query
}: any) {
  const session = await getSession({req});

  // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
  const fetch = getFetcher(session);
  if (!session) return {props: {}};

  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
  const eventResults = await fetch(
    getEvents,

    // @ts-expect-error TS(2532) FIXME: Object is possibly 'undefined'.
    session.isAdmin ? null : { where: [{ managers: { hasSome: [session.user.nickname] } }] }
  );
  return {
    props: {
      eventGroups: eventResults.clear.eventGroups,
      isAdmin: session.isAdmin,
    },
  };
}
