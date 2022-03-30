import React from 'react';
import {Heading} from '@codeday/topo/Atom/Text';
import {print} from 'graphql';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import {getSession} from 'next-auth/react';
import {useFetcher} from '../../../fetch';
import {SponsorsGetEventQuery} from './sponsors.gql';
import SponsorBox from '../../../components/SponsorBox';
import Page from '../../../components/Page';
import Breadcrumbs from '../../../components/Breadcrumbs';
import {CreateSponsorModal} from '../../../components/forms/Sponsor';

export default function Sponsors({event}) {
    if (!event) return <Page/>;
    return (
        <Page title="Sponsors">
            <Breadcrumbs event={event}/>
            <Heading>{event.name} sponsors <CreateSponsorModal event={event}/></Heading>
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2}}>
                <Masonry>
                    {event.sponsors.map((sponsor) => <SponsorBox sponsor={sponsor}/>)}
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    );
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req});
    const fetch = useFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(SponsorsGetEventQuery, {data: {id: eventId}});
    return {
        props: {
            event: eventResults.clear.event,
        },
    };
}
