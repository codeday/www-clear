import React from 'react';
import {Box, Heading} from "@codeday/topo/Atom";
import {getSession} from 'next-auth/react';
import EventGroup from '../../components/EventGroup';

// @ts-expect-error TS(2307) FIXME: Cannot find module './index.gql' or its correspond... Remove this comment to see the full error message
import {getEventGroups} from './index.gql';
import Page from '../../components/Page';
import {getFetcher} from '../../fetch';
import {CreateEventGroupModal} from "../../components/forms/EventGroup";

export default function Groups({
    groups
}: any) {
    if (!groups) return <Page/>;
    return (
        <Page title="Event Groups">
            <Heading>
                Event Groups
                <CreateEventGroupModal />
            </Heading>
            <Box display="flex">
                {groups.map((group: any) => <EventGroup m={4} group={group}/>)}
            </Box>
        </Page>
    );
}

export async function getServerSideProps({
    req
}: any) {
    const session = await getSession({req});

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = getFetcher(session);
    if (!session) return {props: {}};


    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 1.
    const groupsResult = await fetch(getEventGroups);

    return {
        props: {
            groups: groupsResult.clear.eventGroups,
        },
    };
}
