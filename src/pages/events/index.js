import React from 'react';
import {DateTime} from 'luxon';
import {Heading, Box} from "@codeday/topo/Atom";
import {getSession} from 'next-auth/react';
import Page from '../../components/Page';
import {getFetcher} from '../../fetch';
import Event from '../../components/Event';
import {getEvents} from './index.gql';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import getConfig from "next/config";
const {serverRuntimeConfig} = getConfig();


export default function Events({eventGroups}) {
    if (!eventGroups) return <Page/>;
    const now = DateTime.now().minus({ days: 1 });
    return (
        <Page title="Events">
          {eventGroups.map((eg) => (
            <Box mb={12}>
              <Heading textAlign="center">{eg.name}</Heading>
              <ResponsiveMasonry>
                  <Masonry>
                      {eg.events.map((event) => (
                          <Event key={event.id} m={4} event={event}/>
                      ))}
                  </Masonry>
              </ResponsiveMasonry>
            </Box>
          ))}
        </Page>
    );
}

export async function getServerSideProps({req, res, query}) {
    const session = await getSession({req});
    const fetch = getFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(
      getEvents,
      session.isAdmin ? null : { where: { managers: { hasSome: [session.user.nickname] } } }
    );
    return {
        props: {
            eventGroups: eventResults.clear.eventGroups.filter((e) => e.events.length > 0),
        },
    };
}
