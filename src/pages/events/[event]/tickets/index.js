import React from 'react';
import {print} from 'graphql';
import {Heading} from '@codeday/topo/Atom/Text';
import {Flex} from '@codeday/topo/Atom/Box';
import {getSession} from 'next-auth/client';
import {getEventWithTickets} from './index.gql';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import Ticket from '../../../../components/Ticket';
import Page from '../../../../components/Page';
import {useFetcher} from '../../../../fetch';
import {CreateTicketModal} from '../../../../components/forms/Ticket';

export default function Tickets({event}) {
    if (!event) return <Page/>;
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event}/>
            <Heading>{event.name} Tickets</Heading>
            <CreateTicketModal event={event}/>
            <Flex m={4} wrap="wrap">
                {event.tickets.map((ticket) => (
                    <Ticket ticket={ticket}/>))}
            </Flex>
        </Page>
    );
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req});
    const fetch = useFetcher(session);
    if (!session) return {props: {}};
    const eventResult = await fetch(print(getEventWithTickets), {data: {id: eventId}});
    return {
        props: {
            event: eventResult.clear.event,
        },
    };
}
