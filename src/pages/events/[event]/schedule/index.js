import React from 'react';
import {Box, Heading} from "@codeday/topo/Atom";
import {getSession} from 'next-auth/react';
import Page from '../../../../components/Page';
import {getEventWithSchedule} from './index.gql';
import {getFetcher} from '../../../../fetch';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import Calendar from '../../../../components/Calendar';
import {CreateScheduleItemModal} from '../../../../components/forms/ScheduleItem';

export default function Schedule({event}) {
    if (!event) return <Page/>;
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event}/>
            <Heading>{event.name} - Schedule <CreateScheduleItemModal event={event}/> </Heading>
            <Box d="inline-block">
                <Calendar event={event}/>
            </Box>
        </Page>
    );
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req});
    const fetch = getFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(getEventWithSchedule, {data: {id: eventId}});
    return {
        props: {
            event: eventResults.clear.event,
        },
    };
}
