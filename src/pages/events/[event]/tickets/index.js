import React from 'react';
import Page from "../../../../components/Page";
import Ticket from "../../../../components/Ticket"
import {useLocalhostFetcher} from "../../../../fetch";
import {print} from "graphql";
import { getEventWithTickets } from "./tickets.graphql";
import {Heading} from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import {UiAdd} from '@codeday/topocons/Icon'
import {Flex} from '@codeday/topo/Atom/Box'

export default function Tickets({event}) {

    return (
        <Page title={event.name}>
            <Content>
                <Heading>{event.name} Tickets</Heading>
                <Button as="a" href="tickets/create"><UiAdd />New ticket</Button>
                <Flex m={4} wrap="wrap">
                    {event.tickets.map((ticket) => (
                        <Ticket ticket={ticket} />) )}
                </Flex>
            </Content>
        </Page>)
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const fetch = useLocalhostFetcher();
    const eventResult = await fetch(print(getEventWithTickets), {data: {id: eventId}})
    return {
        props: {
            event: eventResult.event
        }
    }
}
