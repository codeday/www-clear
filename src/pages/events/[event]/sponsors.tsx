import React from 'react';
import {Heading} from "@codeday/topo/Atom";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import {getSession} from 'next-auth/react';
import {getFetcher} from '../../../fetch';

// @ts-expect-error TS(2307) FIXME: Cannot find module './sponsors.gql' or its corresp... Remove this comment to see the full error message
import {SponsorsGetEventQuery} from './sponsors.gql';
import SponsorBox from '../../../components/SponsorBox';
import Page from '../../../components/Page';
import Breadcrumbs from '../../../components/Breadcrumbs';
import {CreateSponsorModal} from '../../../components/forms/Sponsor';

export default function Sponsors({
    event
}: any) {
    if (!event) return <Page/>;
    return (
        <Page title="Sponsors">
            <Breadcrumbs event={event}/>
            <Heading>{event.name} sponsors <CreateSponsorModal event={event}/></Heading>
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2}}>
                <Masonry>
                    {event.sponsors.map((sponsor: any) => <SponsorBox key={sponsor.id} currencySymbol={event.region?.currencySymbol} sponsor={sponsor}/>)}
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
    const eventResults = await fetch(SponsorsGetEventQuery, {data: {id: eventId}});
    return {
        props: {
            event: eventResults.clear.event,
        },
    };
}
