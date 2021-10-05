import React from 'react';
import {print} from 'graphql';
import Page from '../../../../../components/Page';
import {useFetcher} from '../../../../../fetch';
import {getTicket} from './ticket.gql';
import Content from '@codeday/topo/Molecule/Content';
import {Heading} from '@codeday/topo/Atom/Text';
import {TicketTypeBadge} from "../../../../../components/Ticket";
import Box, {Flex} from '@codeday/topo/Atom/Box'
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import Alert from "../../../../../components/Alert";
import {getSession} from "next-auth/client";
import {DeleteTicketModal, UpdateTicketModal} from "../../../../../components/forms/Ticket";

export default function Ticket({ticket}) {
    if (!ticket) return <Page/>
    return (
        <Page>
            <Breadcrumbs event={ticket.event} ticket={ticket}/>
            <Content>
                <Flex align="center">
                    <Heading>{ticket.firstName} {ticket.lastName}</Heading>
                    <TicketTypeBadge ml={2} ticket={ticket} flexAlign="center"/>
                    <UpdateTicketModal ticket={ticket}/>
                    <DeleteTicketModal ticket={ticket}/>
                </Flex>
                <br/>
                <Flex>
                    <Box m={4} p={4} bg="gray.50" rounded={5}>
                        <b>Ticket</b>
                        <ul type="none">
                            <li>Email: {ticket.email || <Alert>Missing</Alert>}</li>
                            {ticket.phone ? <li>Phone: {ticket.phone}</li> : null}
                            <li>Age: {ticket.age || <Alert>Missing</Alert>}</li>
                        </ul>
                    </Box>

                    <Box p={4} m={4} bg="gray.50" rounded={5}>
                        <b>Event</b>
                        <ul type="none">
                            <li>{ticket.event.name}</li>
                            <li>{ticket.event.displayDate}</li>
                        </ul>
                    </Box>
                    {ticket.guardian ?
                        <Box p={4} m={4} bg="gray.50" rounded={5}>
                            <b>Guardian</b>
                            <ul type="none">
                                <li>{ticket.guardian.firstName} {ticket.guardian.lastName}</li>
                            </ul>
                        </Box> : null}
                </Flex>
            </Content>
        </Page>
    );
}

export async function getServerSideProps({req, query: {event: eventId, ticket: ticketId}}) {
    const session = await getSession({req})
    const fetch = useFetcher(session);
    if (!session) return {props: {}}
    const ticketResult = await fetch(print(getTicket), {data: {id: ticketId}})
    const ticket = ticketResult?.clear?.ticket
    if (!ticket) return {
        redirect: {
            destination: `/events/${eventId}/tickets`,
            permanent: false
        }
    }
    return {
        props: {
            ticket: ticket
        }
    }
}
