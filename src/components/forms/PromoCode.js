import React, {useState} from 'react';
import Form from "@rjsf/antd";
import {Box, Button, Heading, Text} from "@codeday/topo/Atom";
import {Modal} from "react-responsive-modal";
import 'react-responsive-modal/styles.css';
import * as Icon from "@codeday/topocons/Icon";
import {useFetcher} from "../../fetch";
import {CreatePromoCodeMutation, DeletePromoCodeMutation, UpdatePromoCodeMutation} from "./PromoCode.gql";
import {useToasts} from "@codeday/topo/utils";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

const characters = "ABCDEFGHKPQRSTUVWXYZ";
function generatePromoCode(length) {
    let result = '';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const schema = {
    type: "object",
    properties: {
        code: {
            type: 'string',
            title: 'Code'
        },
        type: {
            type: 'string',
            title: 'Type',
            enum: ["SUBTRACT", "PERCENT"],
            enumNames: ["Subtract Fixed Value", "Percent Discount"]
        },
        amount: {
            type: 'number',
            multipleOf: 0.01
        },
        uses: {
            type: 'number',
            multipleOf: 1,
            title: 'Uses'
        }
    }
}

const uiSchema = {
    uses: {
        "ui:help": "Leave this blank for the code to have unlimited uses"
    }
}

export function CreatePromoCodeModal({event, children, ...props}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(/* if you need to set default values, do so here */);
    const { data: session } = useSession();
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box {...props}>
            <Button onClick={onOpenModal}>{children ? children : <><Icon.UiAdd/>Add Promo Code</>}</Button>
            <Modal open={open} onClose={onCloseModal} center>
                <Heading>Create Promo Code</Heading>
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
                                await fetch(CreatePromoCodeMutation, {
                                    data: {
                                        ...formData,
                                        event: {
                                            connect: {
                                                id: event.id
                                            }
                                        }
                                    }
                                });
                                await router.replace(router.asPath)
                                success('Promo Code Created')
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

export function UpdatePromoCodeModal({promocode, children, ...props}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(promocode);
    const { data: session } = useSession();
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    function formDataToUpdateInput(formData) {
        const ret = {}
        Object.keys(schema.properties).map((key) => {
            if (formData[key] !== promocode[key]) ret[key] = {set: formData[key]}
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
                                await fetch(UpdatePromoCodeMutation, {
                                    where: {id: promocode.id},
                                    data: formDataToUpdateInput(formData)
                                })
                                await router.replace(router.asPath)
                                success('Promo Code Updated')
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

export function DeletePromoCodeModal({promocode, children, ...props}) {
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const router = useRouter();

    return (
        <Box d="inline" {...props}>
            <Button d="inline" onClick={onOpenModal}>{children ? children : <Icon.UiTrash/>}</Button>
            <Modal open={open} onClose={onCloseModal} center>
                <Heading>Remove PromoCode</Heading>
                <Text>Are you sure you want to delete this Promo Code?
                    <br/>
                    There's no turning back!</Text>
                <Button
                    colorScheme="red"
                    disabled={loading}
                    isLoading={loading}
                    onClick={async () => {
                        setLoading(true);
                        try {
                            await fetch(DeletePromoCodeMutation, {where: {id: promocode.id}})
                            await router.replace(router.asPath)
                            success('Promo Code Deleted')
                            onCloseModal()
                        } catch (ex) {
                            error(ex.toString())
                        }
                        setLoading(false);
                    }}
                ><Icon.UiTrash/><b>Delete Promo Code</b></Button>
                <Button onClick={onCloseModal}><Icon.UiX/>Cancel</Button>
            </Modal>
        </Box>
    )
}

export function CreateScholarshipCodeButton({event, children, ...props}) {
    const { data: session } = useSession();
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const router = useRouter();

    return (
        <Button
            d="inline"
            isLoading={loading}
            disabled={loading}
            onClick={async () => {
                setLoading(true)
                try {
                    const result = await fetch(CreatePromoCodeMutation, {
                        data: {
                            code: generatePromoCode(6),
                            type: 'PERCENT',
                            amount: 100,
                            uses: 1,
                            event: {
                                connect: {
                                    id: event.id
                                }
                            }
                        }
                    });
                    await router.push(`/events/${event.id}/promoCodes/${result.clear.createPromoCode.id}`);
                    success('Promo Code Created')
                } catch (ex) {
                    error(ex.toString())
                }
                setLoading(false)
        }
        }
            >
            Generate Scholarship Code
        </Button>
    )
}
