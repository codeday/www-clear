import React, {useState} from 'react';
import {useRouter} from "next/router";
import Button from "@codeday/topo/Atom/Button";
import * as Icon from "@codeday/topocons/Icon";
import Checkbox from "@codeday/topo/Atom/Input/Checkbox"
import Box from "@codeday/topo/Atom/Box"
import {Modal} from "react-responsive-modal";
import {Heading} from "@codeday/topo/Atom/Text"
import {print} from "graphql";
import {UpdateEventRestrictionsMutation} from "./LinkEventRestrictionsModal.gql"
import {useToasts} from "@codeday/topo/utils";
import {getSession} from "next-auth/react";
import {useFetcher} from "../fetch";

export default function LinkEventRestrictionsModal({event, restrictions, children, ...props}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const {success, error} = useToasts();
    let fetch;
    getSession().then((onResolved) => fetch = useFetcher(onResolved));
    const [formData, setFormData] = useState(restrictions.reduce((prev, curr) => {
        return {
            ...prev,
            [curr.id]: event.eventRestrictions.filter(restriction => restriction.id === curr.id).length > 0
        }}, {}))
    const router = useRouter();
    return (
        <Box d="inline" {...props}>
            <Button d="inline" onClick={onOpenModal}>{children ? children : <Icon.UiEdit/>}</Button>
            <Modal open={open} onClose={onCloseModal} center>
                <Heading m={2}>
                    Event Restrictions for {event.name}
                </Heading>
                {restrictions.map((r) => (
                        <Checkbox
                            d="block"
                            isChecked={formData[r.id]}
                            onChange={(e) => {setFormData({...formData, [r.id]:!formData[r.id]})}}
                        >
                            {r.name}
                        </Checkbox>
                    )
                )}
                <Button
                    disabled={loading}
                    isLoading={loading}
                    onClick={async () => {
                        try {
                            // I absolutely hate this, there has to be a cleaner solution
                            let setQuery = restrictions.filter((r) => (formData[r.id]))
                            setQuery.forEach((r, idx) => Object.keys(r).forEach((i) => {if (i !== 'id') delete setQuery[idx][i]}))
                            await fetch(
                                print(UpdateEventRestrictionsMutation),
                                {
                                    where: {id: event.id},
                                    restrictions: {set: setQuery}
                                }
                            )
                            await router.replace(router.asPath)
                            success('Event Restrictions Updated!')
                            onCloseModal()
                        } catch (ex) {
                            error(ex.toString())
                        }
                        setLoading(false);

                    }}
                >
                    Confirm
                </Button>
            </Modal>
        </Box>
    )
}
