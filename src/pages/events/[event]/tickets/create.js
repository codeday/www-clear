import React, {useReducer, useState} from 'react';
import Page from '../../../../components/Page';
import SelectTicketType from "../../../../components/SelectTicketType";
import Text, {Heading} from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import {useToasts} from '@codeday/topo/utils'
import {useLocalhostFetcher} from '../../../../fetch'
import {getEvent} from '../event.graphql';
import {createTicket} from './tickets.graphql';

import {print} from 'graphql';
import TextInput from '@codeday/topo/Atom/Input/Text';
import NumericInput, {Field} from '@codeday/topo/Atom/Input/Numeric'

export default function Create({event}) {
    const fetch = useLocalhostFetcher()
    const {success, error} = useToasts()
    const [ticket, setTicket] = useReducer(
        (prev, next) => Array.isArray(next) ? {...prev, [next[0]]: next[1] } : next, {});
    const [person, setPerson] = useReducer(
        (prev, next) => Array.isArray(next) ? {...prev, [next[0]]: next[1] } : next, {});
    const [loading, setLoading] = useState(false);
    return (
        <Page title="Create Ticket">
            <Content>
                <Heading>Create Ticket for {event.name}</Heading>
                First Name
                <TextInput
                    value={person.firstName}
                    onChange={(e) => {
                        setPerson(['firstName', e.target.value])
                    }}
                />
                Last Name
                <TextInput
                    value={person.lastName}
                    onChange={(e) => {
                        setPerson(['lastName', e.target.value])
                    }}
                />
                Age
                <NumericInput
                    value={person.age}
                    onChange={(e) => {
                        setPerson(['age', parseInt(e)])
                    }}
                >
                    <Field />
                </NumericInput>
                Email
                <TextInput
                    value={ticket.email}
                    onChange={(e) => {
                        setPerson(['email', e.target.value])
                    }}
                />
                Phone
                <NumericInput
                    value={person.phone}
                    onChange={(e) => {
                        setPerson(['phone', e])
                    }}
                >
                    <Field />
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
                            const createTicketResp = await fetch(print(createTicket), {data: {
                                    ...ticket,
                                    event: {
                                        connect: {
                                            id: event.id
                                        }
                                    },
                                    person: {
                                        connectOrCreate: {
                                            create: person,
                                            where: {
                                                email: person.email
                                            }
                                        }
                                    }
                                }});
                            success('Ticket Created');
                        } catch (ex) {
                            error(ex.toString());
                            console.error(ex)
                        }
                        setLoading(false)
                    }}
                >
                Submit
                </Button>
            </Content>
        </Page>
    )
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const fetch = useLocalhostFetcher();
    const eventResult = await fetch(print(getEvent), {data: { id: eventId}})

    return {
        props: {
            event: eventResult.event
        }
    }
}
