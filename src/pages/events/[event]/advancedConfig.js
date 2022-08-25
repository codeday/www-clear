import React from "react";
import Page from "../../../components/Page";
import Breadcrumbs from "../../../components/Breadcrumbs";
import {Heading, Text} from "@codeday/topo/Atom"
import {getSession} from "next-auth/react";
import {getFetcher} from "../../../fetch";
import {UiInfo} from "@codeday/topocons/Icon"
import EditSpecificMetadata from "../../../components/forms/EditSpecificMetadata";
import { SetEventMetadataMutation } from "../../../components/forms/EditSpecificMetadata.gql"
import { getEventAdvancedConfigQuery } from "./advancedConfig.gql"
export default function AdvancedConfig({event}) {
    if (!event) return <Page />
    return (
        <Page title={`Advanced Config - ${event.name}`}>
            <Breadcrumbs event={event} />
            <Heading>{event.name} ~ Advanced Config</Heading>
            <Text><UiInfo />These settings tweak minor things about your event, in most cases they don't need to be used. Before making any changes to these, please consult your CodeDay point of contact.</Text>
            <EditSpecificMetadata
                displayKeyAs="Notice (Hero)"
                metadataKey="notice.hero"
                value={event.noticeHero}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Notice (Top)"
                metadataKey="notice.top"
                value={event.noticeTop}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Notice (Box)"
                metadataKey="notice.box"
                value={event.noticeBox}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Custom Registration Form"
                metadataKey="registration.custom-form"
                value={event.registrationCustomForm}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Registration Collect Org"
                metadataKey="registration.collect-org"
                value={event.registrationCollectOrg}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Override Date Display"
                metadataKey="date.display"
                value={event.dateDisplay}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Hide Global Sponsors"
                metadataKey="sponsors.hide-global"
                value={event.sponsorsHideGlobal}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Hide Covid Restrictions"
                metadataKey="covid.hide"
                value={event.covidHide}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Legal Text"
                metadataKey="legal"
                value={event.legal}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
        </Page>
    )
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req})
    const fetch = getFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(getEventAdvancedConfigQuery, {data: {id: eventId}});
    const event = eventResults?.clear?.event
    if (!event) return {
        redirect: {
            destination: '/events',
            permanent: false
        }
    }
    return {
        props: {
            event: event
        }
    }
}
