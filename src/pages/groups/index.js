import React from 'react';
import {Heading} from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import {UiAdd} from '@codeday/topocons/Icon';
import {print} from 'graphql';
import {getSession} from 'next-auth/react';
import EventGroup from '../../components/EventGroup';
import {getEventGroups} from './index.gql';
import Page from '../../components/Page';
import {useFetcher, getFetcher} from '../../fetch';
import {CreateEventGroupModal} from "../../components/forms/EventGroup";

export default function Groups({groups}) {
    if (!groups) return <Page/>;
    return (
        <Page title="Event Groups">
            <Heading>
                Event Groups
                <CreateEventGroupModal />
            </Heading>
            <Box display="flex">
                {groups.map((group) => (
                    <EventGroup m={4} group={group}/>
                ))}
            </Box>
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
