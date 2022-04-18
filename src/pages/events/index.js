import React from 'react';
import {DateTime} from 'luxon';
import {Heading} from "@codeday/topo/Atom";
import {getSession} from 'next-auth/react';
import Page from '../../components/Page';
import {getFetcher} from '../../fetch';
import Event from '../../components/Event';
import {getEvents} from './index.gql';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';


export default function Events({events}) {
    if (!events) return <Page/>;
    const now = DateTime.now().minus({ days: 1 });
    const upcomingEvents = events.filter((e) => DateTime.fromISO(e.endDate) >= now);
    const pastEvents = events.filter((e) => DateTime.fromISO(e.endDate) < now);
    return (
        <Page title="Events">
            {upcomingEvents.length > 0 && (
                <>
                    <Heading>
                        Upcoming Events
                    </Heading>
                    <ResponsiveMasonry>
                        <Masonry>
                            {upcomingEvents.map((event) => (
                                <Event key={event.id} m={4} event={event}/>
                            ))}
                        </Masonry>
                    </ResponsiveMasonry>
                </>
            )}
            {pastEvents.length > 0 && (
                <>
                    <Heading>
                        Past Events
                    </Heading>
                    <ResponsiveMasonry>
                        <Masonry>
                            {pastEvents.map((event) => (
                                <Event key={event.id} m={4} event={event}/>
                            ))}
                        </Masonry>
                    </ResponsiveMasonry>
                </>
            )}
        </Page>
    );
}

export async function getServerSideProps({req, res, query}) {
    const session = await getSession({req});
    const fetch = getFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(getEvents);
    return {
        props: {
            events: eventResults.clear.events,
        },
    };
}
