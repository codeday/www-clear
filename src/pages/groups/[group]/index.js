import React, {useEffect, useState} from 'react';
import {getEventGroup} from '../groups.graphql'
import Text, { Heading } from '@codeday/topo/Atom/Text'
import Box, {Grid} from '@codeday/topo/Atom/Box';
import Spinner from '@codeday/topo/Atom/Spinner'
import Button from '@codeday/topo/Atom/Button'
import Content from '@codeday/topo/Molecule/Content'
import {useToasts} from '@codeday/topo/utils'
import {useLocalhostFetcher} from "../../../fetch";
import { useRouter } from "next/router";
import moment from 'moment'
import Page from "../../../components/Page";
import Event from "../../../components/Event";
import {print} from 'graphql';

export default function Group({group}){
    const { query } = useRouter();
    const fetch = useLocalhostFetcher();
    const {success, error} = useToasts();
    return (
        <Page title={group.name}>
            <Content>
                <Box>
                        <Heading>{group.name}</Heading>
                    <Box borderWidth={3} mt={4}>
                    <Box display="inline-flex" >
                        <Heading m={4} size="md" display="inline-flex"><b>Events</b></Heading>
                        <Button display="inline-flex" size="sm" alignSelf="center" as="a" href={`${query.group}/createEvent`}>Create New Event</Button>
                    </Box>
                    <Grid templateColumns={{ base: '1fr', md: "repeat(4, 1fr)"}} gap={4} m={4}>
                        {group.events.map((event) => {
                            return <Event event={event} />
                        })}
                    </Grid>
                    </Box>
            </Box>
        </Content>
</Page>
)}

export async function getServerSideProps({req, res, params: {group: groupId}}) {
    const fetch = useLocalhostFetcher()
    const groupResp = await fetch(print(getEventGroup), {'data': {'id': groupId}})
    return {
        props: {
            group: groupResp.eventGroup
        }
    }
}
