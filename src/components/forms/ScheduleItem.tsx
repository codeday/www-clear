import React, {useState} from 'react';
import Form from '@rjsf/chakra-ui';
import {Box, Button, Heading, Text} from "@codeday/topo/Atom";
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from '@codeday/topocons/Icon';
import {useToasts} from '@codeday/topo/utils';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';

// @ts-expect-error TS(2307) FIXME: Cannot find module './ScheduleItem.gql' or its cor... Remove this comment to see the full error message
import {CreateScheduleItemMutation, DeleteScheduleItemMutation, UpdateScheduleItemMutation} from './ScheduleItem.gql';
import {useFetcher} from '../../fetch';
import {useColorModeValue} from "@codeday/topo/Theme";

const schema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
        },
        type: {
            type: 'string',
            title: 'Type',
            examples: [
              "Workshop",
              "Activity",
              "Meal",
              "Deadline",
            ]
        },
        description: {
            type: 'string',
            title: 'Description',
        },
        link: {
            type: 'string',
            title: 'Link',
        },
        start: {
            type: 'string',
            format: 'date-time',
            title: 'Start',
        },
        end: {
            type: 'string',
            format: 'date-time',
            title: 'End',
        },
        hostName: {
            type: 'string',
            title: 'Host Name',
        },
        hostPronoun: {
            type: 'string',
            title: 'Host Pronouns',
        },
        organizerName: {
            type: 'string',
            title: 'Organizer Name',
        },
        organizerEmail: {
            type: 'string',
            title: 'Organizer Email',
        },
        organizerPhone: {
            type: 'string',
            title: 'Organizer Phone',
        },
        finalized: {
            type: 'boolean',
            title: 'Published',
        },
        internal: {
            type: 'boolean',
            title: 'Internal',
        },
    },
    required: [
        'start', 'name',
    ],
};

const uiSchema = {
    type: {
        'ui:help': 'What kind of Schedule Item is this?',
    },
    finalized: {
        'ui:help': 'Is this schedule item ready to be displayed on the event website?',
    },
    internal: {
        'ui:help': 'Internal Schedule Items are only shown to volunteers and staff. An internal event must still be marked as "published" to be displayed internally',
    },
};

export function CreateScheduleItemModal({
    event,
    group,
    children,
    ...props
}: any) {
    if (event && group) throw 'CreateScheduleItemModal must be passed only one of either `event` or `group`';
    if (!event && !group) throw 'CreateScheduleItemModal must be passed `event` or `group`';
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(/* if you need to set default values, do so here */);
    const { data: session } = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false);
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box display="inline" {...props}>
            <Button h={6} onClick={onOpenModal}>{children || <><Icon.UiAdd/>Add Schedule Item</>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Create Schedule Item</Heading>
                <Form
                    uiSchema={uiSchema}

                    // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { name: { type: ... Remove this comment to see the full error message
                    schema={schema}
                    formData={formData}
                    onChange={(data) => setFormData(data.formData)}
                >
                    <Button
                        isLoading={loading}
                        disabled={loading}
                        onClick={async () => {
                            setLoading(true);
                            let connect;
                            if (group) {
                                connect = {
                                    group: {
                                        connect: {
                                            id: group.id,
                                        },
                                    },
                                };
                            } else if (event) {
                                connect = {
                                    event: {
                                        connect: {
                                            id: event.id,
                                        },
                                    },
                                };
                            }
                            try {

                                // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                await fetch(CreateScheduleItemMutation, {
                                    data: {

                                        // @ts-expect-error TS(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
                                        ...formData,
                                        ...connect,
                                    },
                                    /* need to connect the new object
                                                      to a parent object? do so here */
                                });
                                await router.replace(router.asPath);
                                success('Schedule Item Created');
                                onCloseModal();
                            } catch (ex) {

                                // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
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

export function UpdateScheduleItemModal({
    scheduleitem,
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(scheduleitem);
    const { data: session } = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false);
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    function formDataToUpdateInput(formData: any) {
        const ret = {};
        Object.keys(schema.properties).map((key) => {

            // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (formData[key] !== scheduleitem[key]) ret[key] = {set: formData[key]};
        });
        return ret;
    }

    return (
        <Box display="inline" {...props}>
            <Button display="inline" onClick={onOpenModal}>{children || <Icon.UiEdit/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Form
                    uiSchema={uiSchema}

                    // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { name: { type: ... Remove this comment to see the full error message
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

                                // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                await fetch(UpdateScheduleItemMutation, {
                                    where: {id: scheduleitem.id},
                                    data: formDataToUpdateInput(formData),
                                });
                                await router.replace(router.asPath);
                                success('Schedule Item Updated');
                                onCloseModal();
                            } catch (ex) {

                                // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
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

export function DeleteScheduleItemModal({
    scheduleitem,
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false);
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box display="inline" {...props}>
            <Button display="inline" onClick={onOpenModal}>{children || <Icon.UiTrash/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Remove ScheduleItem</Heading>
                <Text>Are you sure you want to delete this Schedule Item?
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

                            // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                            await fetch(DeleteScheduleItemMutation, {where: {id: scheduleitem.id}});
                            await router.replace(router.asPath);
                            success('Schedule Item Deleted');
                            onCloseModal();
                        } catch (ex) {

                            // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                            error(ex.toString());
                        }
                        setLoading(false);
                    }}
                ><Icon.UiTrash/><b>Delete Schedule Item</b>
                </Button>
                <Button onClick={onCloseModal}><Icon.UiX/>Cancel</Button>
            </Modal>
        </Box>
    );
}
