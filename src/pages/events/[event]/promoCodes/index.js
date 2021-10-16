import React from "react";
import {getSession} from "next-auth/client";
import {useFetcher} from "../../../../fetch";
import {print} from "graphql";
import {getEventWithPromoCodesQuery} from "./index.gql";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import Page from "../../../../components/Page"
import {Heading} from "@codeday/topo/Atom/Text"
import PromoCodeBox from "../../../../components/PromoCodeBox";
import {CreatePromoCodeModal} from "../../../../components/forms/PromoCode";
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';

export default function PromoCodes({event}) {
    return (
        <Page title="Promo Codes">
            <Breadcrumbs event={event} />
            <Heading>{event.name} ~ Promo Codes <CreatePromoCodeModal event={event} /></Heading>
            <ResponsiveMasonry>
                <Masonry>
                    {event.promoCodes.map((promoCode) => {
                        return <PromoCodeBox promoCode={promoCode} as="a" href={`promoCodes/${promoCode.id}`} />
                    })}
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    )
}


export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req});
    const fetch = useFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(print(getEventWithPromoCodesQuery), {data: {id: eventId}});
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
