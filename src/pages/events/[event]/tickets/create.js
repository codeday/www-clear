import React, {useReducer, useState} from 'react';
import {Heading} from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import {useToasts} from '@codeday/topo/utils';
import {print} from 'graphql';
import TextInput from '@codeday/topo/Atom/Input/Text';
import NumericInput, {Field} from '@codeday/topo/Atom/Input/Numeric';
import {createTicket, getEvent} from './create.gql';
import SelectTicketType from '../../../../components/SelectTicketType';
import Page from '../../../../components/Page';
import {getFetcher, useFetcher} from '../../../../fetch';
import Breadcrumbs from '../../../../components/Breadcrumbs';

export default function Create({event}) {
    const fetch = useFetcher();
    const {success, error} = useToasts();
    const [ticket, setTicket] = useReducer(
        (prev, next) => (Array.isArray(next) ? {
            ...prev,
            [next[0]]: next[1]
        } : next), {event: {connect: {id: event.id}}},
    );
    const [loading, setLoading] = useState(false);
    return (
        <Page title="Create Ticket">
            <Breadcrumbs event={event}/>
            <Heading>Create Ticket for {event.name}</Heading>
            First Name
            <TextInput
                value={ticket.firstName}
                onChange={(e) => {
                    setTicket(['firstName', e.target.value]);
                }}
            />
            Last Name
            <TextInput
                value={ticket.lastName}
                onChange={(e) => {
                    setTicket(['lastName', e.target.value]);
                }}
            />
            Age
            <NumericInput
                value={ticket.age}
                onChange={(e) => {
                    setTicket(['age', parseInt(e)]);
                }}
            >
                <Field/>
            </NumericInput>
            Email
            <TextInput
                value={ticket.email}
                onChange={(e) => {
                    setTicket(['email', e.target.value]);
                }}
            />
            Phone
            <NumericInput
                value={ticket.phone}
                onChange={(e) => {
                    setTicket(['phone', e]);
                }}
            >
                <Field/>
            </NumericInput>
            <SelectTicketType
                placeholder="Select Ticket Type"
                value={ticket.type}
                onChange={(e) => setTicket(['type', e.target.value])}
            />
            <Button
                isLoading={loading}
                disabled={loading}
                onClick={async () => {
                    setLoading(true);
                    try {
                        const createTicketResp = await fetch(createTicket, {data: ticket});
                        success('Ticket Created');
                    } catch (ex) {
                        error(ex.toString());
                        console.error(ex);
                    }
                    setLoading(false);
                }}
            >
                Submit
            </Button>
        </Page>
    );
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req});
    const fetch = getFetcher(session);
    const eventResult = await fetch(getEvent, {data: {id: eventId}});

    return {
        props: {
            event: eventResult.clear.event,
        },
    };
}
