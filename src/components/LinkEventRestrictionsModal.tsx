import React, {useState} from 'react';
import {useRouter} from "next/router";
import {Box, Button, Checkbox, Heading, Text} from "@codeday/topo/Atom";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from "@codeday/topocons";
import {Modal} from "react-responsive-modal";
import {print} from "graphql";

// @ts-expect-error TS(2307) FIXME: Cannot find module './LinkEventRestrictionsModal.g... Remove this comment to see the full error message
import {UpdateEventRestrictionsMutation} from "./LinkEventRestrictionsModal.gql"
import {useToasts} from "@codeday/topo/utils";
import {useSession} from "next-auth/react";
import {useFetcher} from "../fetch";
import {useColorModeValue} from "@codeday/topo/Theme";

export default function LinkEventRestrictionsModal({
    event,
    restrictions,
    requiredRestrictions,
    children,
    ...props
}: any) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const {success, error} = useToasts();
    const { data: session } = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const [formData, setFormData] = useState(restrictions.reduce((prev: any, curr: any) => {
        return {
            ...prev,
            [curr.id]: (
                (event.cmsEventRestrictions || []).filter((restriction: any) => restriction.id === curr.id).length > 0
                && !((requiredRestrictions || []).filter((restriction: any) => restriction.id === curr.id).length > 0)
            ),
        };}, {}))

    const router = useRouter();
    return (
        <Box display="inline" {...props}>
            <Button display="inline" onClick={onOpenModal}>{children ? children : <Icon.UiEdit/>}</Button>
            <Modal open={open} onClose={onCloseModal} center styles={{modal: {background: useColorModeValue("white", "var(--chakra-colors-gray-1100)")}}}>
                <Heading m={2} mb={0}>
                    Event Restrictions for {event.name}
                </Heading>
                <Text mb={2}>(Red checkmarks are required for your location and cannot be disabled.)</Text>
                {restrictions.map((r: any) => <Checkbox
                    display="block"
                    isChecked={formData[r.id]}
                    isReadOnly={requiredRestrictions.filter((rq: any) => rq.id === r.id).length > 0}
                    isRequired={requiredRestrictions.filter((rq: any) => rq.id === r.id).length > 0}
                    onChange={(e) => {setFormData({...formData, [r.id]:!formData[r.id]})}}
                    disabled={requiredRestrictions.filter((rq: any) => rq.id === r.id).length > 0}
                    colorScheme={requiredRestrictions.filter((rq: any) => rq.id === r.id).length > 0 ? 'red' : 'blue'}
                >
                    {r.name}
                </Checkbox>
                )}
                <Button
                    disabled={loading}
                    isLoading={loading}
                    onClick={async () => {
                        try {
                            // I absolutely hate this, there has to be a cleaner solution
                            let setQuery = restrictions.filter((r: any) => formData[r.id])
                            setQuery.forEach((r: any, idx: any) => Object.keys(r).forEach((i) => {if (i !== 'id') delete setQuery[idx][i]}))

                            // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                            await fetch(
                                print(UpdateEventRestrictionsMutation),
                                {
                                    where: {id: event.id},
                                    restrictions: {set: setQuery.map((e: any) => e.id)}
                                }
                            )
                            await router.replace(router.asPath)
                            success('Event Restrictions Updated!')
                            onCloseModal()
                        } catch (ex) {

                            // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                            error(ex.toString())
                        }
                        setLoading(false);

                    }}
                >
                    Confirm
                </Button>
            </Modal>
        </Box>
    );
}
