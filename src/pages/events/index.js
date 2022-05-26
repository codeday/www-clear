import React from 'react';
import {DateTime} from 'luxon';
import {Heading, Box, Grid, List, ListItem, Text} from "@codeday/topo/Atom";
import {getSession} from 'next-auth/react';
import Page from '../../components/Page';
import {getFetcher} from '../../fetch';
import Event from '../../components/Event';
import {getEvents} from './index.gql';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import getConfig from "next/config";
const {serverRuntimeConfig} = getConfig();


export default function Events({ eventGroups, isAdmin }) {
    if (!eventGroups) return <Page/>;
    const now = DateTime.now().minus({ days: 1 });
    return (
        <Page title="Events">
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
