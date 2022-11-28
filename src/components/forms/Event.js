import React, {useState} from 'react';
import Form from '@rjsf/chakra-ui';

import {Box, Button, Heading, Text} from "@codeday/topo/Atom";
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import * as Icon from '@codeday/topocons/Icon';
import {useColorModeValue} from "@codeday/topo/Theme";

import {useToasts, useTheme} from '@codeday/topo/utils';
import {useRouter} from 'next/router';
import moment from 'moment-timezone';
import {useSession} from 'next-auth/react';
import {CreateEventMutation, DeleteEventMutation, UpdateEventMutation} from './Event.gql';
import {useFetcher} from '../../fetch';
import {InfoAlert} from '../Alert';

const schema = {
    type: 'object',
    properties: {
        name: {
            title: 'Name',
            type: 'string',
        },
        startDate: {
            title: 'Start Date',
            type: 'string',
            format: 'date',
        },
        endDate: {
            title: 'End Date',
            type: 'string',
            format: 'date',
        },
        ticketPrice: {
            title: 'Ticket Price',
            type: 'number',
            multipleOf: 0.01,
        },
        earlyBirdPrice: {
            title: 'Early Bird Ticket Price',
            type: 'number',
            multipleOf: 0.01,
        },
        groupPrice: {
            type: "number",
            multipleOf: 0.01,
            title: "School Group Price"
        },
        earlyBirdCutoff: {
            title: 'Early Bird Registration Cutoff',
            description: 'Usually set to a month before the event',
            type: 'string',
            format: 'date',
        },
        registrationCutoff: {
            title: 'Registration Cutoff',
            type: 'string',
            format: 'date',
        },
        contentfulWebname: {
          title: 'Contentful region ID',
          type: 'string'
        },
        managers: {
            title: 'Regional Managers',
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'string',
            },
        },
        timezone: {
            title: 'Timezone (IANA)',
            type: 'string'
        },
        majorityAge: {
            title: 'Age of majority',
            type: 'number',
            default: 18
        },
        overnightMinAge: {
            title: 'Minimum age to stay overnight',
            type: 'number',
            default: 14
        },
        minAge: {
            title: 'Minimum age to register',
            type: 'number',
            default: 12
        },
        maxAge: {
            title: 'Maximum age to register',
            type: 'number',
            default: 25
        },
        requiresPromoCode: {
            type: 'boolean',
            title: 'Requires Promo Code'
        }
    },
};

const uiSchema = {
    managers: {
        'ui:options': {
            orderable: false,
        },
        'ui:description': "(CodeDay Account usernames)",
        "chakra": {
            color: "blue.200"
        },
    },
    requiresPromoCode: {
        'ui:help': 'Should people only be allowed to register if they have a promo code? (For instance if the event is invite-only) This should most of the time be false.'
    }
};

export function CreateEventModal({group, children, ...props}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        startDate: moment(group.startDate).utc().format('YYYY-MM-DD'),
        endDate: moment(group.endDate).utc().format('YYYY-MM-DD'),
        ticketPrice: group.ticketPrice,
        earlyBirdPrice: group.earlyBirdPrice,
        groupPrice: group.groupPrice,
        earlyBirdCutoff: moment(group.earlyBirdCutoff).utc().format('YYYY-MM-DD'),
        registrationCutoff: moment(group.registrationCutoff).utc().format('YYYY-MM-DD'),
    });
    const { data: session } = useSession();
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false);
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box {...props}>
            <Button onClick={onOpenModal}>{children || <><Icon.UiAdd/>Add Event</>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Create Event</Heading>
                <InfoAlert>Default values have been autofilled from the Event Group</InfoAlert>
                <Form
                    uiSchema={uiSchema}
                    schema={schema}
                    formData={formData}
                    onChange={(data) => setFormData(data.formData)}
                >
                    <Button
                        isLoading={loading}
                        disabled={loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await fetch(CreateEventMutation, {
                                    data: {
                                        ...formData,
                                        managers: {
                                            set: formData.managers || []
                                        },
                                        eventGroup: {
                                            connect: {id: group.id},
                                        },
                                    },
                                });
                                await router.replace(router.asPath);
                                success('Event Created');
                                onCloseModal();
                            } catch (ex) {
                                error(ex.toString());
                            }
                            setLoading(false);
                        }}
                    >Submit
                    </Button>
                </Form>
            </Modal>
        </Box>
    );
}

export function UpdateEventModal({event, children, ...props}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        ...event,
        startDate: moment(event.startDate).utc().format('YYYY-MM-DD'),
        endDate: moment(event.endDate).utc().format('YYYY-MM-DD'),
        earlyBirdCutoff: moment(event.earlyBirdCutoff).utc().format('YYYY-MM-DD'),
        registrationCutoff: moment(event.registrationCutoff).utc().format('YYYY-MM-DD'),
    });
    const { data: session } = useSession();
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false);
    const {success, error} = useToasts();
    const theme = useTheme();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    function formDataToUpdateInput(formData) {
        const ret = {};
        Object.keys(schema.properties).map((key) => {
            if (formData[key] !== event[key]) ret[key] = {set: formData[key]};
        });
        return ret;
    }
    return (
        <Box d="inline" {...props}>
            <Button d="inline" onClick={onOpenModal}>{children || <Icon.UiEdit/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Form
                    uiSchema={uiSchema}
                    schema={schema}
                    formData={formData}
                    onChange={(data) => setFormData(data.formData)}
                >
                    <Button
                        isLoading={loading}
                        disabled={loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await fetch(UpdateEventMutation, {
                                    where: {id: event.id},
                                    data: formDataToUpdateInput(formData)
                                });
                                await router.replace(router.asPath);
                                success('Event Updated');
                                onCloseModal();
                            } catch (ex) {
                                error(ex.toString());
                            }
                            setLoading(false);
                        }}
                    >Submit
                    </Button>
                </Form>
            </Modal>
        </Box>
    );
}

export function DeleteEventModal({event, children, ...props}) {
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false);
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box d="inline">
            <Button d="inline" onClick={onOpenModal}>{children || <Icon.UiTrash/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Remove Event</Heading>
                <Text>Are you sure you want to delete this event?
                    <br/>
                    There's no turning back!
                </Text>
                <Button
                    colorScheme="red"
                    disabled={loading}
                    isLoading={loading}
                    onClick={async () => {
                        setLoading(true);
                        try {
                            await fetch(DeleteEventMutation, {where: {id: event.id}});
                            await router.replace(router.asPath);
                            success('Event Deleted');
                            onCloseModal();
                        } catch (ex) {
                            error(ex.toString());
                        }
                        setLoading(false);
                    }}
                ><Icon.UiTrash/><b>Delete Event</b>
                </Button>
                <Button onClick={onCloseModal}><Icon.UiX/>Cancel</Button>
            </Modal>
        </Box>
    );
}
