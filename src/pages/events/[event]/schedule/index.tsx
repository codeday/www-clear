import React from 'react';
import {Box, Heading} from "@codeday/topo/Atom";
import {getSession} from 'next-auth/react';
import Page from '../../../../components/Page';

// @ts-expect-error TS(2307) FIXME: Cannot find module './index.gql' or its correspond... Remove this comment to see the full error message
import {getEventWithSchedule} from './index.gql';
import {getFetcher} from '../../../../fetch';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import Calendar from '../../../../components/Calendar';
import {CreateScheduleItemModal} from '../../../../components/forms/ScheduleItem';

export default function Schedule({
    event
}: any) {
    if (!event) return <Page/>;
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event}/>
            <Heading>{event.name} - Schedule <CreateScheduleItemModal event={event}/> </Heading>
            <Box display="inline-block">
                <Calendar event={event}/>
            </Box>
        </Page>
    );
}

export async function getServerSideProps({
    req,
    res,
    query: {event: eventId}
}: any) {
    const session = await getSession({req});

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = getFetcher(session);
    if (!session) return {props: {}};

    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
    const eventResults = await fetch(getEventWithSchedule, {data: {id: eventId}});
    return {
        props: {
            event: eventResults.clear.event,
        },
    };
}
