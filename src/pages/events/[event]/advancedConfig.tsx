import React from "react";
import Page from "../../../components/Page";
import Breadcrumbs from "../../../components/Breadcrumbs";
import {Heading, Text} from "@codeday/topo/Atom"
import {getSession} from "next-auth/react";
import {getFetcher} from "../../../fetch";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import {UiInfo} from "@codeday/topocons"
import EditSpecificMetadata from "../../../components/forms/EditSpecificMetadata";

// @ts-expect-error TS(2307) FIXME: Cannot find module '../../../components/forms/Edit... Remove this comment to see the full error message
import { SetEventMetadataMutation } from "../../../components/forms/EditSpecificMetadata.gql"

// @ts-expect-error TS(2307) FIXME: Cannot find module './advancedConfig.gql' or its c... Remove this comment to see the full error message
import { getEventAdvancedConfigQuery } from "./advancedConfig.gql"
export default function AdvancedConfig({
    event
}: any) {
    if (!event) return <Page />
    return (
        <Page title={`Advanced Config - ${event.name}`}>
            <Breadcrumbs event={event} />
            <Heading>{event.name} ~ Advanced Config</Heading>
            <Text mb={4}>
              <UiInfo />{' '}
              These settings tweak how other apps and sites display your event. They only need to be changed in rare
              circumstances, so consult your CodeDay staff contact before making changes.
            </Text>
            <EditSpecificMetadata
                displayKeyAs="Event date/time string"
                description="Override this text for events which are not 24-hour, noon-to-noon."
                placeholder="January 1-2, noon to noon"
                metadataKey="date.display"
                value={event.dateDisplay}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Alert: Word"
                description="A word displayed in a large red box above the event name."
                placeholder="CANCELED"
                metadataKey="notice.hero"
                value={event.noticeHero}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Alert: Bar"
                description="Short sentence displayed at the very top of the page in a full-width red bar."
                placeholder="This event has been canceled."
                metadataKey="notice.top"
                value={event.noticeTop}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Alert: Box"
                description="Paragraph with more details about an alert, displayed in a red box below the header."
                metadataKey="notice.box"
                value={event.noticeBox}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Collect school/club during registration?"
                description="(Designed for free events which can't use promo codes.) Set this to 1 to require all participants to specify which school/club they're registering with."
                metadataKey="registration.collect-org"
                value={event.registrationCollectOrg}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Require both phone AND email?"
                description="By default events require either a phone OR an email. Set this to 1 if you want your event to require both."
                metadataKey="registration.contact-and"
                value={event.registrationContactAnd}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="External Registration Name"
                description="If External Registration URL is also set, sets the display name of where to register."
                metadataKey="registration.external.name"
                value={event.registrationExternalName}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="External Registration URL"
                description="Redirects registration to use a third-party page."
                metadataKey="registration.external.url"
                value={event.registrationExternalUrl}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
            <EditSpecificMetadata
                displayKeyAs="Legal text"
                description="Sponsor trademark notice or other required legal text."
                metadataKey="legal"
                value={event.legal}
                setMutation={SetEventMetadataMutation}
                updateId={event.id}
            />
        </Page>
    )
}

export async function getServerSideProps({
    req,
    res,
    query: {event: eventId}
}: any) {
    const session = await getSession({req})

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = getFetcher(session);
    if (!session) return {props: {}};

    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
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
