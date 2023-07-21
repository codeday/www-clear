import React, {useState} from 'react';
import Form from '@rjsf/chakra-ui';
import {Box, Button, Heading, Text} from "@codeday/topo/Atom";
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import * as Icon from '@codeday/topocons';
import {useToasts} from '@codeday/topo/utils';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';

// @ts-expect-error TS(2307) FIXME: Cannot find module './Venue.gql' or its correspond... Remove this comment to see the full error message
import {CreateVenueMutation, DeleteVenueMutation, UpdateVenueMutation} from './Venue.gql';
import {useFetcher} from '../../fetch';
import {InfoAlert} from '../Alert';
import {useColorModeValue} from "@codeday/topo/Theme";

const schema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
        },
        capacity: {
            type: 'integer',
            title: 'Capacity',
        },
        addressLine1: {
            type: 'string',
            title: 'Address Line 1'
        },
        addressLine2: {
            type: 'string',
            title: 'Address Line 2',
        },
        addressLine3: {
            type: 'string',
            title: 'Address Line 3',
        },
        city: {
            type: 'string',
            title: 'City',
        },
        state: {
            type: 'string',
            title: 'State'
        },
        stateAbbreviation: {
            type: 'string',
            title: 'State Abbreviation'
        },
        zipCode: {
            type: 'string',
            title: 'ZIP code'
        },
        country: {
            type: 'string',
            title: 'Country'
        },
        countryAbbreviation: {
            type: 'string',
            title: 'Country Abbreviation'
        },
        mapLink: {
            type: 'string',
            title: 'Map link',
        },
        contactName: {
            type: 'string',
            title: 'Contact Name',
        },
        contactEmail: {
            type: 'string',
            title: 'Contact Email',
        },
        contactPhone: {
            type: 'string',
            title: 'Contact Phone',
        },
    },
};

export function CreateVenueModal({
    event,
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState();
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
            <Button h={6} onClick={onOpenModal}>{children || <><Icon.UiAdd/>Add Venue</>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Create Venue</Heading>
                <InfoAlert>You can leave anything you aren't sure of yet blank and edit later!</InfoAlert>
                <Form

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
                                const venueResp = await fetch(CreateVenueMutation, {
                                    data: {

                                        // @ts-expect-error TS(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
                                        ...formData,
                                        events: {
                                            connect: [{id: event.id}],
                                        },
                                    },
                                });
                                await router.replace(router.asPath);
                                success('Venue Created');
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

export function UpdateVenueModal({
    venue,
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(venue);
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
            if (formData[key] !== venue[key]) ret[key] = {set: formData[key]};
        });
        return ret;
    }

    return (
        <Box display="inline" {...props}>
            <Button h={6} display="inline" onClick={onOpenModal}>{children || <Icon.UiEdit/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Form

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
                                const venueResp = await fetch(UpdateVenueMutation, {
                                    where: {id: venue.id},
                                    data: formDataToUpdateInput(formData)
                                });
                                await router.replace(router.asPath);
                                success('Venue Updated');
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

export function DeleteVenueModal({
    venue,
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
        <Box display="inline">
            <Button h={6} display="inline" onClick={onOpenModal}>{children || <Icon.UiTrash/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Remove Venue</Heading>
                <Text>Are you sure you want to delete this venue?
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
                            await fetch(DeleteVenueMutation, {where: {id: venue.id}});
                            await router.replace(router.asPath);
                            success('Venue Deleted');
                            onCloseModal();
                        } catch (ex) {

                            // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                            error(ex.toString());
                        }
                        setLoading(false);
                    }}
                ><Icon.UiTrash/><b>Delete Venue</b>
                </Button>
                <Button onClick={onCloseModal}><Icon.UiX/>Cancel</Button>
            </Modal>
        </Box>
    );
}
