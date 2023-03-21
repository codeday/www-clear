import React from 'react';
import { Heading } from '@codeday/topo/Atom';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import { getFetcher } from '../../../fetch';
import { SponsorsGetEventQuery } from './sponsors.gql';
import SponsorBox from '../../../components/SponsorBox';
import Page from '../../../components/Page';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { CreateSponsorModal } from '../../../components/forms/Sponsor';

export default function Sponsors({ event }) {
  if (!event) return <></>;
  return (
    <>
      <Breadcrumbs event={event} />
      <Heading>{event.name} sponsors <CreateSponsorModal event={event} /></Heading>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
        <Masonry>
          {event.sponsors.map((sponsor) => (
            <SponsorBox key={sponsor.id} currencySymbol={event.region?.currencySymbol} sponsor={sponsor} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}

export async function getServerSideProps({ req, res, query: { event: eventId } }) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const eventResults = await fetch(SponsorsGetEventQuery, { data: { id: eventId } });
  return {
    props: {
      title: 'Sponsors',
      event: eventResults.clear.event,
    },
  };
}
