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
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import {CSVLink} from "react-csv";
import Button from "@codeday/topo/Atom/Button";
import {UiDownload} from "@codeday/topocons/Icon"
export default function Tickets({event}) {
    if (!event) return <Page/>;
    const headers = [
        "firstName",
        "lastName",
        "age",
        "email",
        "phone",
        "type",
        "guardianFirstName",
        "guardianLastName",
        "guardianEmail",
        "guardianPhone",
    ];
    const csv = event.tickets.map((t) => [
        t.firstName,
        t.lastName,
        t.age,
        t.email,
        t.phone,
        t.type,
        t.guardian?.firstName || '',
        t.guardian?.lastName || '',
        t.guardian?.email || '',
        t.guardian?.phone || '',
    ].join(',')).join(`\n`);
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event}/>
            <Heading>{event.name} Tickets</Heading>
            <CreateTicketModal event={event} d="inline" pr={4}/>
            <Button d="inline">
                <CSVLink data={csv} headers={headers} filename="tickets.csv">
                    <UiDownload />Download as CSV
                </CSVLink>
            </Button>
            <ResponsiveMasonry>
                <Masonry>
                    {event.tickets.map((ticket) => (
                        <Ticket ticket={ticket}/>))}
                </Masonry>
            </ResponsiveMasonry>
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
