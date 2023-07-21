import React from 'react';

// @ts-expect-error TS(2307) FIXME: Cannot find module './index.gql' or its correspond... Remove this comment to see the full error message
import {getEventGroup} from './index.gql'
import {Box, Grid, Heading} from "@codeday/topo/Atom";
import {getFetcher} from "../../../fetch";
import {useRouter} from "next/router";
import Page from "../../../components/Page";
import Event from "../../../components/Event";
import Breadcrumbs from "../../../components/Breadcrumbs";
import {getSession} from "next-auth/react";
import {CreateEventModal} from "../../../components/forms/Event";
import {DeleteEventGroupModal, UpdateEventGroupModal} from "../../../components/forms/EventGroup";

export default function Group({
    group
}: any) {
    if (!group) return <Page/>
    const {query} = useRouter();
    return (
        <Page title={group.name}>
            <Breadcrumbs group={group}/>
            <Heading>{group.name} <UpdateEventGroupModal eventgroup={group}/> <DeleteEventGroupModal eventgroup={group} /></Heading>
            <Box display="inline-flex">
                <Heading m={4} size="md" display="inline-flex"><b>Events</b></Heading>
                <CreateEventModal group={group}/>
            </Box>
            <Grid templateColumns={{base: '1fr', md: "repeat(4, 1fr)"}} gap={4} m={4}>
                {group.events?.map((event: any) => {
                    return <Event event={event} key={event.id}/>
                })}
            </Grid>
            {/*<Heading m={4} size="md" display="inline-flex"><b>Schedule</b></Heading>*/}
            {/*<Button display="inline-flex"*/}
            {/*        size="sm"*/}
            {/*        alignSelf="center"*/}
            {/*        as="a"*/}
            {/*        href={`${query.group}/schedule/createScheduleItem`}>Create Schedule Item</Button>*/}
            {/*<Calendar schedule={group.schedule} />*/}
        </Page>
    );
}

export async function getServerSideProps({
    req,
    res,
    params: {group: groupId}
}: any) {
    const session = await getSession({req})

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = getFetcher(session);
    if (!session) return {props: {}}

    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
    const groupResp = await fetch(getEventGroup, {'data': {'id': groupId}})
    return {
        props: {
            group: groupResp.clear.eventGroup
        }
    }
}
