import React, {useReducer, useState} from 'react';
import {print} from 'graphql';
import Text, {Heading} from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import {default as TextInput} from '@codeday/topo/Atom/Input/Text';
import {Decrement, default as NumInput, Field, Increment, Stepper,} from '@codeday/topo/Atom/Input/Numeric';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-date-picker/dist/DatePicker.css';
import Button from '@codeday/topo/Atom/Button';
import 'react-calendar/dist/Calendar.css';
import {useToasts} from '@codeday/topo/utils';
import Page from '../../components/Page';
import {createEventGroup} from './create.gql';
import {useFetcher, getFetcher} from '../../fetch';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useSession } from 'next-auth/react';

export default function CreateGroup() {
    const { data: session } = useSession();
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false);
    const {success, error} = useToasts();
    const [group, setGroup] = useReducer(
        (prev, next) => (Array.isArray(next) ? {...prev, [next[0]]: next[1]} : next), {
            ticketPrice: 20.00,
            earlyBirdPrice: 15.00
        },
    );
    return (
        <Page title="Create Event Group">
            <Breadcrumbs/>
            {/* // name */}
            {/* // startDate */}
            {/* // endDate */}
            {/* // ticketPrice */}
            {/* // earlyBirdPrice */}
            {/* // earlyBirdCutoff */}
            {/* // registrationCutoff */}
            <Heading>Create Event Group</Heading>
            <Box m={10}>
                <Text p={2}>Name</Text>
                <TextInput
                    placeholder="Fall 2021"
                    value={group.name}
                    onChange={(e) => setGroup(['name', e.target.value])}
                />
                <Text p={2}>Date</Text>
                <DateRangePicker
                    onChange={(value) => {
                        setGroup(['startDate', value[0]]);
                        setGroup(['endDate', value[1]]);
                    }}
                    value={[group.startDate, group.endDate]}
                />
                {/* startDate */}
                {/* endDate */}
                <Text p={2}>Ticket Price</Text>
                <NumInput
                    precision={2}
                    step={1}
                    defaultValue={20}
                    value={group.ticketPrice}
                    onChange={(e) => setGroup(['ticketPrice', parseFloat(e)])}
                >
                    <Field/>
                    <Stepper>
                        <Increment/>
                        <Decrement/>
                    </Stepper>
                </NumInput>
                <Text p={2}>Early Bird Ticket Price</Text>
                <NumInput
                    precision={2}
                    step={1}
                    defaultValue={15}
                    value={group.earlyBirdPrice}
                    onChange={(e) => setGroup(['earlyBirdPrice', parseFloat(e)])}
                >
                    <Field/>
                    <Stepper>
                        <Increment/>
                        <Decrement/>
                    </Stepper>
                </NumInput>
                <Text p={2}>Early bird cutoff date</Text>
                <DatePicker
                    onChange={(value) => setGroup(['earlyBirdCutoff', value])}
                    value={group.earlyBirdCutoff}
                />
                <Text>Registration cutoff date</Text>
                <DatePicker
                    onChange={(value) => setGroup(['registrationCutoff', value])}
                    value={group.registrationCutoff}
                />
            </Box>
            <Button
                isLoading={loading}
                disabled={loading}
                onClick={async () => {
                    setLoading(true);
                    try {
                        const groupResp = await fetch(createEventGroup, {data: group});
                        success('Event Group Created');
                    } catch (ex) {
                        error(ex.toString());
                    }
                    setLoading(false);
                }}
            >
                Create
            </Button>
        </Page>
    );
}
