import React from "react";
import {getSession} from "next-auth/react";
import {getFetcher} from "../../../../fetch";

// @ts-expect-error TS(2307) FIXME: Cannot find module './index.gql' or its correspond... Remove this comment to see the full error message
import {getEventWithPromoCodesQuery} from "./index.gql";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import Page from "../../../../components/Page"
import {Heading} from "@codeday/topo/Atom";
import PromoCodeBox from "../../../../components/PromoCodeBox";
import {CreatePromoCodeModal, CreateScholarshipCodeButton} from "../../../../components/forms/PromoCode";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';

export default function PromoCodes({
    event
}: any) {
    return (
        <Page title="Promo Codes">
            <Breadcrumbs event={event} />
            <Heading>{event.name} ~ Promo Codes <CreatePromoCodeModal display="inline" event={event} /> <CreateScholarshipCodeButton event={event} /></Heading>
            <ResponsiveMasonry>
                <Masonry>
                    {event.promoCodes.map((promoCode: any) => {
                        return <PromoCodeBox promoCode={promoCode} as="a" href={`promoCodes/${promoCode.id}`} />
                    })}
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    );
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
    const eventResults = await fetch(getEventWithPromoCodesQuery, {data: {id: eventId}});
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
