import React, {useEffect, useReducer, useState} from 'react'
import {print} from 'graphql'
import Page from '../../../../components/Page'
import Text, {Heading} from '@codeday/topo/Atom/Text'
import Box from '@codeday/topo/Atom/Box'
import TextInput from '@codeday/topo/Atom/Input/Text'
import TextareaInput from "@codeday/topo/Atom/Input/Textarea";
import SelectInput from "@codeday/topo/Atom/Input/Select"
import DateTimePicker from "react-datetime-picker/dist/entry.nostyle"
import "react-datetime-picker/dist/DateTimePicker.css"
import 'react-calendar/dist/Calendar.css' // Required for DateTimePicker
import "react-clock/dist/Clock.css" // Required for DateTimePicker
import moment from "moment-timezone"
import Button from '@codeday/topo/Atom/Button'
import {useToasts} from '@codeday/topo/utils'
import {createScheduleItem, getEventGroup} from './createScheduleItem.gql';
import {useFetcher} from "../../../../fetch";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import CreatePerson from '../../../../components/CreatePerson'
import * as Icon from "@codeday/topocons/Icon"

export default function CreateScheduleItem({group}) {
    const fetch = useFetcher();
    const [loading, setLoading] = useState(false);
    const {success, error} = useToasts()
    const [scheduleItem, setScheduleItem] = useReducer(
        (prev, next) => Array.isArray(next) ? {...prev, [next[0]]: next[1]} : next, {'hosts': [], 'start': new Date()});
    const [timezone, setTimezone] = useState('America/Los_Angeles');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
    }, [typeof window]);

    return (
        <Page title="Create Schedule Item">
            <Breadcrumbs group={group}/>
            <Heading>Create new schedule item in {group.name}</Heading>
            <Text>
                This item will be listed on the schedule as a global event.
                <br/>
                Note: This should not be used for schedule items such as doors opening or meal times, as those need
                to be localized for an individual event's timezone
            </Text>
            <Box m={10} borderWidth={3} p={8}>
                <Text>Name</Text>
                <TextInput
                    placeholder="Cross-CodeDay Food Fight"
                    value={scheduleItem.name}
                    onChange={(e) => setScheduleItem(['name', e.target.value])}
                />
                <Text>Description</Text>
                <TextareaInput
                    placeholder="Event details and any additional notes go here"
                    value={scheduleItem.description}
                    onChange={(e) => setScheduleItem(['description', e.target.value])}
                />
                Start
                <DateTimePicker
                    value={scheduleItem.start}
                    onChange={(val) => setScheduleItem(['start', val])}
                    calendarIcon={<Icon.Calendar/>}
                    clearIcon={<Icon.UiX/>}
                    disableClock
                />
                End
                <DateTimePicker
                    value={scheduleItem.end}
                    onChange={(val) => setScheduleItem(['end', val])}
                    calendarIcon={<Icon.Calendar/>}
                    clearIcon={<Icon.UiX/>}
                    disableClock
                />
                <Text>(End time can be left blank to represent an item with no duration, such as a deadline)</Text>
                <Text>Timezone </Text>
                <SelectInput
                    display="inline"
                    onChange={(e) => setTimezone(e.target.value)}
                >
                    {moment.tz.zonesForCountry('US').map((val, idx) => {
                        return <option
                            selected={val === timezone}
                            key={idx}
                        >
                            {val}
                        </option>
                    })}
                </SelectInput>

                <Text mt={4} mb={2}>Hosts</Text>
                <Button onClick={() => setScheduleItem(['hosts', [{}, ...scheduleItem.hosts]])}>Add Host</Button>
                <ul type="none">
                    {scheduleItem.hosts?.map((host, idx) => {
                        return <li>
                            <CreatePerson
                                person={host}
                                onChange={(value) => {
                                    scheduleItem.hosts[idx] = value
                                    setScheduleItem(['hosts', scheduleItem.hosts])
                                }}
                                onRemove={() => {
                                    setScheduleItem([
                                        'hosts', scheduleItem.hosts.filter(value => {
                                            return value !== host
                                        })
                                    ])
                                }}
                            />
                        </li>
                    })}
                </ul>

                <Text mt={4} mb={2}>Organizers</Text>
                <Button onClick={() => setScheduleItem(['organizers', [{}, ...scheduleItem.organizers]])}>Add
                    Host</Button>
                <ul type="none">
                    {scheduleItem.organizers?.map((organizer, idx) => {
                        return <li>
                            <CreatePerson
                                person={organizer}
                                onChange={(value) => {
                                    scheduleItem.organizers[idx] = value
                                    setScheduleItem(['organizers', scheduleItem.organizers])
                                }}
                                onRemove={() => {
                                    setScheduleItem([
                                        'organizers', scheduleItem.organizers.filter(value => {
                                            return value !== organizer
                                        })
                                    ])
                                }}
                            />
                        </li>
                    })}
                </ul>
            </Box>
            <Button
                isLoading={loading}
                disabled={loading}
                onClick={async () => {
                    setLoading(true);
                    try {
                        const eventResp = await fetch(print(createScheduleItem), {
                            data: {
                                ...scheduleItem,
                                eventGroup: {
                                    connect: {
                                        id: group.id
                                    }
                                },
                                hosts: {
                                    create: scheduleItem.hosts.map((host => ({
                                        firstName: host.firstName,
                                        lastName: host.lastName,
                                        email: host.email,
                                        pronouns: host.pronouns,
                                    })))
                                },
                                organizers: {
                                    create: scheduleItem.hosts.map((host => ({
                                        firstName: host.firstName,
                                        lastName: host.lastName,
                                        email: host.email,
                                        pronouns: host.pronouns,
                                    })))
                                }
                            }
                        });
                        success('Schedule Item Created');
                    } catch (ex) {
                        error(ex.toString());
                        console.error(ex)
                    }
                    setLoading(false)
                }}>
                Create
            </Button>
        </Page>
    )
}

export async function getServerSideProps({req, res, params: {group: groupId}}) {
    const fetch = useFetcher()
    const groupResp = await fetch(print(getEventGroup), {data: {'id': groupId}})
    return {
        props: {
            group: groupResp.clear.eventGroup
        }
    }
}

