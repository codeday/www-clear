import React from 'react';
import {getSession} from "next-auth/client";
import {useFetcher} from "../../../../fetch";
import {print} from "graphql";
import {GetPromoCodeQuery} from "./promoCode.gql";
import Page from "../../../../components/Page";
import {Heading} from "@codeday/topo/Atom/Text"
import Breadcrumbs from "../../../../components/Breadcrumbs";
import InfoBox from "../../../../components/InfoBox";
import {DeletePromoCodeModal, UpdatePromoCodeModal} from "../../../../components/forms/PromoCode";
import Notes from "../../../../components/forms/Notes";
import {SetPromoCodeNotesMutation} from "../../../../components/forms/Notes.gql"
import PromoCodeBox from "../../../../components/PromoCodeBox";
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import Ticket from "../../../../components/Ticket";


export default function PromoCode({code}) {
    if (!code) return <Page />
    return (
        <Page title="Promo Code">
            <Breadcrumbs event={code.event} code={code} />
            <Heading>Promo Code ~ {code.code} <UpdatePromoCodeModal promocode={code} /> <DeletePromoCodeModal promocode={code} /></Heading>
            <ResponsiveMasonry>
                <Masonry>
                    <PromoCodeBox promoCode={code} heading="details"/>
                    <Notes notes={code.notes} updateId={code.id} updateMutation={SetPromoCodeNotesMutation} />
                </Masonry>
            </ResponsiveMasonry>
            Registrations using this code:
            <ResponsiveMasonry>
                <Masonry>
                    {code.tickets.map((ticket) => { return <Ticket ticket={ticket} /> })}
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    )
}

export async function getServerSideProps({req, res, query: {event: eventId, promoCode: codeId}}) {
    const session = await getSession({req});
    const fetch = useFetcher(session);
    if (!session) return {props: {}};
    const codeResults = await fetch(GetPromoCodeQuery, {data: {id: codeId}});
    const code = codeResults?.clear?.promoCode
    if (!code) return {
        redirect: {
            destination: `/events/${eventId}/promoCodes`,
            permanent: false
        }
    }
    return {
        props: {
            code: code,
        },
    };
}
