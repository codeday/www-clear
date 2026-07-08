import React from 'react';
import {Grid, Heading} from "@codeday/topo/Atom";
import {getSession} from 'next-auth/react';
import EventGroup from '../../components/EventGroup';
import {getEventGroups} from './index.gql';
import Page from '../../components/Page';
import {getFetcher} from '../../fetch';
import {CreateEventGroupModal} from "../../components/forms/EventGroup";

export default function Groups({groups}) {
    if (!groups) return <Page/>;
    return (
        <Page title="Event Groups">
            <Heading>
                Event Groups
                <CreateEventGroupModal />
            </Heading>
            <Grid templateColumns={{base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}} gap={4}>
                {groups.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).map((group) => (
                    <EventGroup key={group.id} group={group}/>
                ))}
            </Grid>
        </Page>

    );
}

export async function getServerSideProps({req}) {
    const session = await getSession({req});
    const fetch = getFetcher(session);
    if (!session) return {props: {}};

    const groupsResult = await fetch(getEventGroups);

    return {
        props: {
            groups: groupsResult.clear.eventGroups,
        },
    };
}
