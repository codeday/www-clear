import React, {useState} from 'react';
import Form from "@rjsf/antd";
import Box from "@codeday/topo/Atom/Box"
import Button from "@codeday/topo/Atom/Button"
import Text, {Heading} from "@codeday/topo/Atom/Text"
import {Modal} from "react-responsive-modal";
import 'react-responsive-modal/styles.css';
import * as Icon from "@codeday/topocons/Icon";
import {InfoAlert} from "../Alert";
import {useFetcher} from "../../fetch";
import {getSession} from 'next-auth/client';
import {
    CreateCovidRestrictionMutation,
    UpdateCovidRestrictionMutation,
    DeleteCovidRestrictionMutation
} from "./CovidRestriction.gql";
import {print} from "graphql";
import {useToasts} from "@codeday/topo/utils";
import {useRouter} from "next/router";
import moment from "moment-timezone";

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

export function CreateCovidRestrictionModal({children, ...props}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(/* if you need to set default values, do so here */);
    let fetch;
    getSession().then((onResolved) => fetch = useFetcher(onResolved));
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box {...props}>
            <Button onClick={onOpenModal}>{children ? children : <><Icon.UiAdd/>Add CovidRestriction</>}</Button>
            <Modal open={open} onClose={onCloseModal} center>
                <Heading>Create CovidRestriction</Heading>
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
                                await fetch(print(CreateCovidRestrictionMutation), {
                                    data: formData
                                    /* need to connect the new object
                                    to a parent object? do so here */
                                });
                                await router.replace(router.asPath)
                                success('CovidRestriction Created')
                                onCloseModal()
                            } catch (ex) {
                                error(ex.toString())
                            }
                            setLoading(false)
                        }}>Submit</Button>
                </Form>
            </Modal>
        </Box>
    )
}

export function UpdateCovidRestrictionModal({covidrestriction, children, ...props}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(covidrestriction);
    let fetch;
    getSession().then((onResolved) => fetch = useFetcher(onResolved));
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    function formDataToUpdateInput(formData) {
        const ret = {}
        Object.keys(schema.properties).map((key) => {
            if (formData[key] !== covidrestriction[key]) ret[key] = {set: formData[key]}
        })
        return ret
    }

    return (
        <Box d="inline" {...props}>
            <Button d="inline" onClick={onOpenModal}>{children ? children : <Icon.UiEdit/>}</Button>
            <Modal open={open} onClose={onCloseModal} center>
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
                                await fetch(print(UpdateCovidRestrictionMutation), {
                                    where: {id: covidrestriction.id},
                                    data: formDataToUpdateInput(formData)
                                })
                                await router.replace(router.asPath)
                                success('CovidRestriction Updated')
                                onCloseModal()
                            } catch (ex) {
                                error(ex.toString())
                            }
                            setLoading(false)
                        }}>Submit</Button>
                </Form>
            </Modal>
        </Box>
    )
}

export function DeleteCovidRestrictionModal({covidrestriction, children, ...props}) {
    const [open, setOpen] = useState(false);
    let fetch;
    getSession().then((onResolved) => fetch = useFetcher(onResolved));
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box d="inline" {...props}>
            <Button d="inline" onClick={onOpenModal}>{children ? children : <Icon.UiTrash/>}</Button>
            <Modal open={open} onClose={onCloseModal} center>
                <Heading>Remove CovidRestriction</Heading>
                <Text>Are you sure you want to delete this CovidRestriction?
                    <br/>
                    There's no turning back!</Text>
                <Button
                    colorScheme="red"
                    disabled={loading}
                    isLoading={loading}
                    onClick={async () => {
                        setLoading(true);
                        try {
                            await fetch(print(DeleteCovidRestrictionMutation), {where: {id: covidrestriction.id}})
                            await router.replace(router.asPath)
                            success('CovidRestriction Deleted')
                            onCloseModal()
                        } catch (ex) {
                            error(ex.toString())
                        }
                        setLoading(false);
                    }}
                ><Icon.UiTrash/><b>Delete CovidRestriction</b></Button>
                <Button onClick={onCloseModal}><Icon.UiX/>Cancel</Button>
            </Modal>
        </Box>
    )
}
