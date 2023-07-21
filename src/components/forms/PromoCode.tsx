import React, {useState} from 'react';
import Form from "@rjsf/chakra-ui";
import {Box, Button, Heading, Text} from "@codeday/topo/Atom";
import {Modal} from "react-responsive-modal";
import 'react-responsive-modal/styles.css';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from "@codeday/topocons";
import {useFetcher} from "../../fetch";

// @ts-expect-error TS(2307) FIXME: Cannot find module './PromoCode.gql' or its corres... Remove this comment to see the full error message
import {CreatePromoCodeMutation, DeletePromoCodeMutation, UpdatePromoCodeMutation, SetPromoCodeMetatataMutation} from "./PromoCode.gql";
import {useToasts} from "@codeday/topo/utils";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useColorModeValue} from "@codeday/topo/Theme";

const characters = "ABCDEFGHKPQRSTUVWXYZ";
function generatePromoCode(length: any) {
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
        },
        enablesUber: {
          type: 'boolean',
          title: 'Enables requesting a free Uber ride?',
          description: '(For promo codes provided exclusively to low-income schools.)',
        },
        enablesLaptops: {
          type: 'boolean',
          title: 'Enables requesting a free laptop?',
          description: '(For promo codes provided exclusively to low-income schools.)',
        },
    }
}

const uiSchema = {
    uses: {
        "ui:help": "Leave this blank for the code to have unlimited uses"
    },
    enablesUber: {
      "ui:help": '(For promo codes provided exclusively to low-income schools.)',
    },
    enablesLaptops: {
      "ui:help": '(This is for a laptop to keep, NOT a loaner laptop. For promo codes provided exclusively to low-income schools.)',
    },
}

export function CreatePromoCodeModal({
    event,
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
            <Button onClick={onOpenModal}>{children ? children : <><Icon.UiAdd/>Add Promo Code</>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading>Create Promo Code</Heading>
                <Form
                    uiSchema={uiSchema}

                    // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { code: { type: ... Remove this comment to see the full error message
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

                                // @ts-expect-error TS(2339) FIXME: Property 'enablesUber' does not exist on type 'und... Remove this comment to see the full error message
                                const { enablesUber, enablesLaptops, ...baseData } = formData;

                                // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                await fetch(CreatePromoCodeMutation, {
                                    data: {
                                        ...baseData,
                                        metadata: {
                                          ...(enablesUber ? { uber: "true" } : {}),
                                          ...(enablesLaptops ? { laptop: "true" } : {}),
                                        },
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

export function UpdatePromoCodeModal({
    promocode,
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(promocode);
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
            if (formData[key] !== promocode[key]) ret[key] = {set: formData[key]}
        })
        return ret
    }

    return (
        <Box display="inline" {...props}>
            <Button display="inline" onClick={onOpenModal}>{children ? children : <Icon.UiEdit/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Form
                    uiSchema={uiSchema}

                    // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { code: { type: ... Remove this comment to see the full error message
                    schema={schema}
                    formData={formData}
                    onChange={(data) => setFormData(data.formData)}
                >
                    <Button
                        isLoading={loading}
                        disabled={loading}
                        onClick={async () => {
                            setLoading(true);

                            // @ts-expect-error TS(2339) FIXME: Property 'enablesUber' does not exist on type '{}'... Remove this comment to see the full error message
                            const { enablesUber, enablesLaptops, ...baseData } = formDataToUpdateInput(formData);
                            try {

                                // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                await fetch(UpdatePromoCodeMutation, {
                                    where: {id: promocode.id},
                                    data: baseData,
                                });
                                if (typeof enablesUber !== 'undefined') {

                                  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                  await fetch(SetPromoCodeMetatataMutation, {
                                    id: promocode.id,
                                    key: "uber",
                                    value: enablesUber.set ? "true" : "",
                                  });
                                }
                                if (typeof enablesLaptops !== 'undefined') {

                                  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                  await fetch(SetPromoCodeMetatataMutation, {
                                    id: promocode.id,
                                    key: "laptop",
                                    value: enablesLaptops.set ? "true" : "",
                                  });
                                }
                                await router.replace(router.asPath)
                                success('Promo Code Updated')
                                onCloseModal()
                            } catch (ex) {
                                console.error(ex);

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

export function DeletePromoCodeModal({
    promocode,
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

                            // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                            await fetch(DeletePromoCodeMutation, {where: {id: promocode.id}})
                            await router.replace(router.asPath)
                            success('Promo Code Deleted')
                            onCloseModal()
                        } catch (ex) {

                            // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
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

export function CreateScholarshipCodeButton({
    event,
    children,
    ...props
}: any) {
    const { data: session } = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts();
    const router = useRouter();

    return (
        <Button
            display="inline"
            isLoading={loading}
            disabled={loading}
            onClick={async () => {
                setLoading(true)
                try {

                    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
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

                    // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
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
