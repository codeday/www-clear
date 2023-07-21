import React from 'react';
import Breadcrumbs from "../../../components/Breadcrumbs";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import {EventRestrictionPreview} from "../../../components/EventRestriction";
import Page from "../../../components/Page"
import {Heading} from "@codeday/topo/Atom";
import {getSession} from "next-auth/react";
import {getFetcher} from "../../../fetch";

// @ts-expect-error TS(2307) FIXME: Cannot find module './eventRestrictions.gql' or it... Remove this comment to see the full error message
import {GetEventRestrictionsQuery} from "./eventRestrictions.gql"
import LinkEventRestrictionsModal from "../../../components/LinkEventRestrictionsModal";
import InfoBox from "../../../components/InfoBox";

export default function EventRestrictions({
    event,
    restrictions
}: any) {
    const requiredRestrictions = event?.region?.localizationConfig?.requiredEventRestrictions?.items || [];
    if (!event) return <Page />
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event} />
            <Heading display="inline">{event.name} ~ Event Restrictions</Heading>
            <LinkEventRestrictionsModal event={event} restrictions={restrictions.items} requiredRestrictions={requiredRestrictions} />
            <ResponsiveMasonry>
                <Masonry>
                    {[
                        ...event.cmsEventRestrictions,
                        ...requiredRestrictions,
                    ].map((r) => <InfoBox heading={r.name}><EventRestrictionPreview eventRestriction={r} /></InfoBox>)}
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    )
}

export async function getServerSideProps({
    req,
    res,
    query: {event: eventId}
}: any) {
    const session = await getSession({req});

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = getFetcher(session);
    if (!session) return {props: {}};

    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
    const eventResults = await fetch(GetEventRestrictionsQuery, {data: {id: eventId}})
    return {
        props: {
            event: eventResults.clear.event,
            restrictions: eventResults.cms.eventRestrictions
        }
    }

}
