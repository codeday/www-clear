import React from 'react';
import Page from '../../../components/Page'
import Content from '@codeday/topo/Molecule/Content'
import {getEvent} from './event.graphql'
import {useLocalhostFetcher} from "../../../fetch";
import {print} from 'graphql';
import Text, {Heading} from '@codeday/topo/Atom/Text'
export default function Event({event}) {
    return <Page title={event.name}>
        <Content>
            <Heading>{event.name}</Heading>
            <Text>{event.eventGroup.name}</Text>
        </Content>
    </Page>
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const fetch = useLocalhostFetcher();
    const eventResults = await fetch(print(getEvent), {data: {id: eventId}})
    return {
        props: {
            event: eventResults.event
        }
    }
}
