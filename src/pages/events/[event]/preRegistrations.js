import React from "react";
import Page from "../../../components/Page";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { UiInfo } from "@codeday/topocons/Icon";
import Text, {Heading} from "@codeday/topo/Atom/Text";
import {getSession} from "next-auth/react";
import {getFetcher} from "../../../fetch";
import {getEventPreRegistrationsQuery} from "./preRegistrations.gql"

export default function PreRegistrations({event}) {
    if (!event) return <Page />
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event} />
            <Heading>{event.name} ~ Pre Registrations</Heading>
            <Text><UiInfo />This is a list of people who asked to be notified when registrations are live</Text>
            <Text>
                {event.interestedEmails.map(email => (
                    <>{email.email} <br/></>
                ))}
            </Text>
        </Page>
    )
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req});
    const fetch = getFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(getEventPreRegistrationsQuery, {data: {id: eventId}});
    const event = eventResults?.clear?.event
    if (!event) return {
        redirect: {
            destination: `/events`,
            permanent: false
        }
    }
    return {
        props: {
            event: event,
        },
    };
}
