import React, {useState} from 'react';
import Form from "@rjsf/chakra-ui";
import {Box, Button, Heading, Text} from "@codeday/topo/Atom";
import {Modal} from "react-responsive-modal";
import 'react-responsive-modal/styles.css';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from "@codeday/topocons/Icon";
import {useFetcher} from "../../fetch";
import {useSession} from 'next-auth/react';
import {
    CreateEventRestrictionMutation,
    DeleteEventRestrictionMutation,
    UpdateEventRestrictionMutation
// @ts-expect-error TS(2307) FIXME: Cannot find module './EventRestriction.gql' or its... Remove this comment to see the full error message
} from "./EventRestriction.gql";
import {useToasts} from "@codeday/topo/utils";
import {useRouter} from "next/router";
import {useColorModeValue} from "@codeday/topo/Theme";

const schema = {
    type: "object",
    properties: {
        name: {
            title: 'Name (internal)',
            type: 'string'
        },
        title: {
            title: 'Title (supports markdown)',
            type: 'string'
        },
        details: {
            title: 'Details (supports markdown)',
            type: 'string'
        }
    }
}

const uiSchema = {
    details: {
        'ui:widget': 'textarea'
    }
}

export function CreateEventRestrictionModal({
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(/* if you need to set default values, do so here */);
    const { data: session } = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box {...props}>
            <Button onClick={onOpenModal}>{children ? children : <><Icon.UiAdd/>Add Event Restriction</>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Create Event Restriction</Heading>
                <Form
                    uiSchema={uiSchema}

                    // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { name: { title:... Remove this comment to see the full error message
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
                                await fetch(CreateEventRestrictionMutation, {
                                    data: formData
                                    /* need to connect the new object
                                    to a parent object? do so here */
                                });
                                await router.replace(router.asPath)
                                success('EventRestriction Created')
                                onCloseModal()
                            } catch (ex) {

                                // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                                error(ex.toString())
                            }
                            setLoading(false)
                        }}>Submit</Button>
                </Form>
            </Modal>
        </Box>
    )
}

export function UpdateEventRestrictionModal({
    eventrestriction,
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(eventrestriction);
    const { data: session } = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    function formDataToUpdateInput(formData: any) {
        const ret = {}
        Object.keys(schema.properties).map((key) => {

            // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (formData[key] !== eventrestriction[key]) ret[key] = {set: formData[key]}
        })
        return ret
    }

    return (
        <Box display="inline" {...props}>
            <Button display="inline" onClick={onOpenModal}>{children ? children : <Icon.UiEdit/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Form
                    uiSchema={uiSchema}

                    // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { name: { title:... Remove this comment to see the full error message
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
                                await fetch(UpdateEventRestrictionMutation, {
                                    where: {id: eventrestriction.id},
                                    data: formDataToUpdateInput(formData)
                                })
                                await router.replace(router.asPath)
                                success('Event Restriction Updated')
                                onCloseModal()
                            } catch (ex) {

                                // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                                error(ex.toString())
                            }
                            setLoading(false)
                        }}>Submit</Button>
                </Form>
            </Modal>
        </Box>
    )
}

export function DeleteEventRestrictionModal({
    eventrestriction,
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box display="inline" {...props}>
            <Button display="inline" onClick={onOpenModal}>{children ? children : <Icon.UiTrash/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Remove EventRestriction</Heading>
                <Text>Are you sure you want to delete this Event Restriction?
                    <br/>
                    There's no turning back!</Text>
                <Button
                    colorScheme="red"
                    disabled={loading}
                    isLoading={loading}
                    onClick={async () => {
                        setLoading(true);
                        try {

                            // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                            await fetch(DeleteEventRestrictionMutation, {where: {id: eventrestriction.id}})
                            await router.replace(router.asPath)
                            success('EventRestriction Deleted')
                            onCloseModal()
                        } catch (ex) {

                            // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                            error(ex.toString())
                        }
                        setLoading(false);
                    }}
                ><Icon.UiTrash/><b>Delete Event Restriction</b></Button>
                <Button onClick={onCloseModal}><Icon.UiX/>Cancel</Button>
            </Modal>
        </Box>
    )
}
