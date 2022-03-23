import React, {useState} from "react";
import Switch from "@codeday/topo/Atom/Input/Switch"
import Alert, {GoodAlert, WarningAlert} from "./Alert"
import Box from "@codeday/topo/Atom/Box"
import InfoBox from "./InfoBox"
import Text, {Heading} from "@codeday/topo/Atom/Text"
import {useFetcher} from "../fetch";
import {useToasts} from "@codeday/topo/utils"
import {print} from "graphql";
import {RegistrationsToggleMutation} from "./RegistrationsToggleWithChecklist.gql"
import {useRouter} from "next/router";
import {getSession} from "next-auth/client";

export default function RegistrationsToggleWithChecklist({event, children, ...props}) {
    const checks = [
        {
            severity: "error",
            failedMsg: "No Venue",
            passedMsg: "Has Venue",
            check: Boolean(event.venue),
        },
        {
            severity: "error",
            failedMsg: "Venue Capacity Missing",
            passedMsg: "Venue Capacity Set",
            check: Boolean(event.venue?.capacity > 0),
        },
        {
            severity: "warning",
            failedMsg: "Venue Contact Details Missing",
            passedMsg: "Venue Contact Details Set",
            check: Boolean(event.venue?.contactName &&
                event.venue?.contactEmail &&
                event.venue?.contactPhone)
        },
        {
            severity: "error",
            failedMsg: "Venue Address Missing",
            passedMsg: "Venue Address Set",
            check: Boolean(event.venue?.address)
        },
        {
            severity: "error",
            failedMsg: "Venue Map Link Missing",
            passedMsg: "Venue Map Link Set",
            check: Boolean(event.venue?.mapLink)
        },
        {
            severity: "warning",
            failedMsg: "No Finalized Items On Schedule",
            passedMsg: "Items On Schedule",
            check: Boolean(event.schedule.filter((item) => {
                return item.finalized
            }).length > 0)
        },
        {
            severity: "warning",
            failedMsg: "No Sponsors",
            passedMsg: "Has Sponsors",
            check: Boolean(event.sponsors.length > 0)
        }
    ];
    const disabled = Boolean(checks.filter((check) => check.severity === "error" && !check.check).length > 0)
    const [loading, setLoading] = useState(false);
    const {success, error} = useToasts();
    let fetch;
    getSession().then((onResolved) => fetch = useFetcher(onResolved))
    const router = useRouter();
    return (
        <InfoBox heading="Event Status" headingSize="xl">
            <Box fontSize="2xl" fontWeight="bold">
                <Text as="span">Registrations are&nbsp;</Text>
                {event.registrationsOpen ?
                    <Text as="span" color="green">open.</Text> :
                    <Text as="span" color="gray.500">closed.</Text>
                }
            </Box>
            <Switch
                m={2}
                isChecked={event.registrationsOpen}
                isDisabled={(disabled && !event.registrationsOpen || loading)}
                size="lg"
                colorScheme="green"
                onChange={async (e) => {
                    setLoading(true)
                    try {
                        console.log(e)
                        await fetch(RegistrationsToggleMutation, {
                            eventWhere: {id: event.id},
                            data: e.target.checked
                        })
                        await router.replace(router.asPath); // kind of clunky solution to refresh serverSideProps after update; https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
                        success(`Registrations ${e.target.checked ? "opened" : "closed"}`)
                    } catch (ex) {
                        error(ex.toString())
                    }
                    setLoading(false)
                }}
            />
            <Box m={2}>
                {checks.filter((check) => !check.check).map((check) => {
                    if (check.severity === "warning") {
                        return <><WarningAlert m={0.5}>{check.failedMsg}</WarningAlert><br/></>
                    } else {
                        return <><Alert m={0.5}>{check.failedMsg}</Alert><br/></>
                    }
                })}
            </Box>
        </InfoBox>
    )
}
