import React, {useReducer, useState} from 'react';
import {print} from 'graphql';
import { getSession, useSession } from 'next-auth/react';
import Content from '@codeday/topo/Molecule/Content';
import Text, {Heading, Link} from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import {default as TextInput} from '@codeday/topo/Atom/Input/Text';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css'; // Required for DatePicker
import Button from '@codeday/topo/Atom/Button';
import {useToasts} from '@codeday/topo/utils';
import {AccountDisplayFromUsername} from '../../../components/AccountDisplay';
import Page from '../../../components/Page';
import {createEventMutation, getEventGroup} from './createEvent.gql';
import {getFetcher, useFetcher} from '../../../fetch';
import Breadcrumbs from '../../../components/Breadcrumbs';

export default function CreateEvent({group}) {
    const { data: session } = useSession()
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false);
    const [manager, setManager] = useState();
    const {success, error} = useToasts();
    const [event, setEvent] = useReducer(
        (prev, next) => (Array.isArray(next) ? {...prev, [next[0]]: next[1]} : next), {
            startDate: group.startDate,
            endDate: group.endDate,
            ticketPrice: group.ticketPrice,
            earlyBirdPrice: group.earlyBirdPrice,
            earlyBirdCutoff: group.earlyBirdCutoff,
            registrationCutoff: group.registrationCutoff,
            managers: [],
        },
    );
    return (
        <Page title="Create Event">
            <Content>
                {/* // name */}
                <Breadcrumbs group={group}/>
                <Heading>Create new event in {group.name}</Heading>
                <Text>Event details can be set by a manager after creation</Text>
                <Box m={10} borderWidth={3} p={8}>
                    <Text>Name</Text>
                    <TextInput
                        placeholder="CodeDay Boston"
                        value={event.name}
                        onChange={(e) => setEvent(['name', e.target.value])}
                    />
                    <Text mt={4} mb={2}>Managers</Text>
                    <ul type="none">
                        {event.managers.map((manager) => (
                            <li>
                                <AccountDisplayFromUsername username={manager}>
                                    <Link
                                        color="gray.500"
                                        onClick={() => {
                                            setEvent(['managers', event.managers.filter((value) => value !== manager)]);
                                        }}
                                    >(remove)
                                    </Link>
                                </AccountDisplayFromUsername>
                            </li>
                        ))}
                    </ul>
                    <Box display="flex">
                        <TextInput
                            width="sm"
                            placeholder="CodeDay Account Username"
                            value={manager}
                            onChange={(e) => setManager(e.target.value)}
                        />
                        <Button
                            ml={4}
                            onClick={() => {
                                setEvent(['managers', [...event.managers, manager]]);
                                setManager('');
                            }}
                        >Add Manager
                        </Button>
                    </Box>
                </Box>
                <Button
                    isLoading={loading}
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        try {
                            const eventResp = await fetch(createEventMutation, {
                                data: {
                                    ...event,
                                    managers: {
                                        set: event.managers,
                                    },
                                    eventGroup: {
                                        connect: {
                                            id: group.id,
                                        },
                                    },
                                },
                            });
                            success('Event Created');
                        } catch (ex) {
                            error(ex.toString());
                            console.error(ex);
                        }
                        setLoading(false);
                    }}
                >
                    Create
                </Button>
            </Content>
        </Page>
    );
}

export async function getServerSideProps({req, res, params: {group: groupId}}) {
    const session = await getSession();
    const fetch = getFetcher(session);
    const groupResp = await fetch(getEventGroup, {data: {id: groupId}});
    return {
        props: {
            group: groupResp.clear.eventGroup,
        },
    };
}
