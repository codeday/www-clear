import React, {useState} from 'react';
import Form from '@rjsf/chakra-ui';
import {Box, Button, Heading, Text} from "@codeday/topo/Atom";
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icons from '@codeday/topocons/Icon';
import { Icon } from '@chakra-ui/react';
import {useToasts} from '@codeday/topo/utils';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';

// @ts-expect-error TS(2307) FIXME: Cannot find module './Ticket.gql' or its correspon... Remove this comment to see the full error message
import {CreateTicketMutation, DeleteTicketMutation, UpdateTicketMutation} from './Ticket.gql';
import {useFetcher} from '../../fetch';
import {useColorModeValue} from "@codeday/topo/Theme";

export const ticketTypeEnum = [
    {
        type: 'string',
        title: 'Student',
        enum: ['STUDENT']
    },
    {
        type: 'string',
        title: 'Teacher',
        enum: ['TEACHER']
    },
    {
        type: 'string',
        title: 'VIP',
        enum: ['VIP']
    },
    {
        type: 'string',
        title: 'Mentor',
        enum: ['MENTOR']
    },
    {
        type: 'string',
        title: 'Judge',
        enum: ['JUDGE']
    },
    {
        type: 'string',
        title: 'Staff',
        enum: ['STAFF']
    }
]

const schema = {
    type: 'object',
    properties: {
        firstName: {
            type: 'string',
            title: 'First Name',
        },
        lastName: {
            type: 'string',
            title: 'Last Name',
        },
        email: {
            type: 'string',
            title: 'Email',
        },
        phone: {
            type: 'string',
            title: 'Phone',
        },
        whatsApp: {
            type: 'string',
            title: 'WhatsApp',
        },
        age: {
            type: 'integer',
            title: 'Age',
        },
        type: {
            type: 'string',
            title: 'Type',
            default: 'STUDENT',
            anyOf: ticketTypeEnum
        },
        username: {
            type: 'string',
            title: 'Username',
        },
    },
    required: ['firstName', 'lastName']
};

const uiSchema = {
    username: {
        'ui:help': 'Username from account.codeday.org. RECOMMENDED FOR STAFF as this affects how you are displayed to the public on event pages.'
    }
};

export function CreateTicketModal({
    event,
    children,
    ...props
}: any) {
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
        <Box {...props}>
            <Button onClick={onOpenModal}>{children || <>< Icon mr={2} as={Icons.UiAdd} />Add Ticket</>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Create Ticket</Heading>
                <Form
                    uiSchema={uiSchema}

                    // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { firstName: { t... Remove this comment to see the full error message
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
                                await fetch(CreateTicketMutation, {
                                    data: {

                                        // @ts-expect-error TS(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
                                        ...formData,
                                        event: {
                                            connect: {
                                                id: event.id,
                                            },
                                        },
                                    },
                                });
                                await router.replace(router.asPath);
                                success('Ticket Created');

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

export function UpdateTicketModal({
    ticket,
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(ticket);
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
            if (formData[key] !== ticket[key]) ret[key] = {set: formData[key]};
        });
        return ret;
    }

    return (
        <Box display="inline" {...props}>
            <Button display="inline" onClick={onOpenModal}>{children || <Icons.UiEdit/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Form
                    uiSchema={uiSchema}

                    // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { firstName: { t... Remove this comment to see the full error message
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
                                await fetch(UpdateTicketMutation, {
                                    where: {id: ticket.id},
                                    data: formDataToUpdateInput(formData),
                                });
                                await router.replace(router.asPath);
                                success('Ticket Updated');
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

export function DeleteTicketModal({
    ticket,
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
            <Button display="inline" onClick={onOpenModal}>{children || <Icons.UiTrash/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Remove Ticket</Heading>
                <Text>Are you sure you want to delete this Ticket?
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
                            await fetch(DeleteTicketMutation, {where: {id: ticket.id}});
                            await router.replace(router.asPath);
                            success('Ticket Deleted');
                            onCloseModal();
                        } catch (ex) {

                            // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                            error(ex.toString());
                        }
                        setLoading(false);
                    }}
                ><Icons.UiTrash/><b>Delete Ticket</b>
                </Button>
                <Button onClick={onCloseModal}><Icons.UiX/>Cancel</Button>
            </Modal>
        </Box>
    );
}
