import React from 'react';
import {Heading} from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import {print} from 'graphql';
import {getSession} from 'next-auth/client';
import Page from '../../components/Page';
import {useFetcher} from '../../fetch';
import Event from '../../components/Event';
import {getEvents} from './index.gql';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';


export default function Events({events}) {
    if (!events) return <Page/>;
    return (
        <Page title="Events">
            <Heading>
                My Events
            </Heading>
            <ResponsiveMasonry>
                <Masonry>
                    {events.map((event) => (
                        <Event m={4} event={event}/>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    );
}

export async function getServerSideProps({req, res, query}) {
    const session = await getSession({req});
    const fetch = useFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(print(getEvents));
    console.log(eventResults)
    return {
        props: {
            events: eventResults.clear.events,
        },
    };
}
