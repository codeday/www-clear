import React from 'react';
import {getSession} from "next-auth/react";
import {getFetcher} from "../../../../fetch";

// @ts-expect-error TS(2307) FIXME: Cannot find module './promoCode.gql' or its corres... Remove this comment to see the full error message
import {GetPromoCodeQuery} from "./promoCode.gql";
import Page from "../../../../components/Page";
import {Heading} from "@codeday/topo/Atom";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import {DeletePromoCodeModal, UpdatePromoCodeModal} from "../../../../components/forms/PromoCode";
import Notes from "../../../../components/forms/Notes";

// @ts-expect-error TS(2307) FIXME: Cannot find module '../../../../components/forms/N... Remove this comment to see the full error message
import {SetPromoCodeNotesMutation} from "../../../../components/forms/Notes.gql"
import PromoCodeBox from "../../../../components/PromoCodeBox";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import Ticket from "../../../../components/Ticket";
import MetadataBox from '../../../../components/MetadataBox';


export default function PromoCode({
    code
}: any) {
    if (!code) return <Page />
    return (
        <Page title="Promo Code">
            <Breadcrumbs event={code.event} code={code} />
            <Heading>Promo Code ~ {code.code} <UpdatePromoCodeModal promocode={code} /> <DeletePromoCodeModal promocode={code} /></Heading>
            <ResponsiveMasonry>
                <Masonry>
                    <PromoCodeBox promoCode={code} heading="details"/>
                    <Notes notes={code.notes} updateId={code.id} updateMutation={SetPromoCodeNotesMutation} />
                    // @ts-expect-error TS(2786): 'MetadataBox' cannot be used as a JSX component.
                    // @ts-expect-error TS(2786) FIXME: 'MetadataBox' cannot be used as a JSX component.
                    <MetadataBox metadata={code.metadata} />
                </Masonry>
            </ResponsiveMasonry>
            Registrations using this code:
            <ResponsiveMasonry>
                <Masonry>
                    {code.tickets.map((ticket: any) => { return <Ticket ticket={ticket} /> })}
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    );
}

export async function getServerSideProps({
    req,
    res,
    query: {event: eventId, promoCode: codeId}
}: any) {
    const session = await getSession({req});

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = getFetcher(session);
    if (!session) return {props: {}};

    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
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
