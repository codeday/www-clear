import React from 'react';
import {print} from 'graphql';
import {Heading} from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import {getSession} from 'next-auth/react';
import Page from '../../../../components/Page';
import {getEventWithSchedule} from './index.gql';
import {useFetcher} from '../../../../fetch';
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
    const fetch = useFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(print(getEventWithSchedule), {data: {id: eventId}});
    return {
        props: {
            event: eventResults.clear.event,
        },
    };
}
