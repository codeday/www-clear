import React from 'react';
import {getSession} from 'next-auth/react';
import {Box, Button, Grid, Heading, Text} from "@codeday/topo/Atom";
import {getEventWithTickets} from './index.gql';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import Ticket from '../../../../components/Ticket';
import Page from '../../../../components/Page';
import {getFetcher} from '../../../../fetch';
import {CreateTicketModal} from '../../../../components/forms/Ticket';
import {CSVLink} from "react-csv";
import {UiDownload} from "@codeday/topocons/Icon";
import {useColorModeValue} from "@codeday/topo/Theme";

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
            <Box p={4} mt={8} mb={4} backgroundColor={useColorModeValue("blue.50", "blue.500")} borderColor={useColorModeValue("blue.500", "blue.50")} borderWidth={1} fontSize="lg">
                <Text>
                    Attendees/parents can e-sign missing waivers on their own phone. Have them show you the
                    confirmation screen!
                </Text>
                <Text mb={0}>
                  <Text as="span" bold>CodeDay.to/Waiver</Text> (under 18)
                </Text>
                <Text>
                  <Text as="span" bold>CodeDay.to/AdultWaiver</Text> (over 18)
                </Text>
            </Box>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}}>
              {event.tickets.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1).map((ticket) => (
                  <Ticket ticket={ticket} />))}
            </Grid>
        </Page>
    );
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req});
    const fetch = getFetcher(session);
    if (!session) return {props: {}};
    const eventResult = await fetch(getEventWithTickets, {data: {id: eventId}});
    return {
        props: {
            event: eventResult.clear.event,
        },
    };
}
