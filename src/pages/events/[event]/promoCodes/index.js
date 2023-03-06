import React from 'react';
import { getSession } from 'next-auth/react';
import { Heading } from '@codeday/topo/Atom';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { getFetcher } from '../../../../fetch';
import { getEventWithPromoCodesQuery } from './index.gql';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import Page from '../../../../components/Page';
import PromoCodeBox from '../../../../components/PromoCodeBox';
import { CreatePromoCodeModal, CreateScholarshipCodeButton } from '../../../../components/forms/PromoCode';

export default function PromoCodes({ event }) {
  return (
    <Page title="Promo Codes">
      <Breadcrumbs event={event} />
      <Heading>{event.name} ~ Promo Codes <CreatePromoCodeModal display="inline" event={event} /> <CreateScholarshipCodeButton event={event} /></Heading>
      <ResponsiveMasonry>
        <Masonry>
          {event.promoCodes.map((promoCode) => <PromoCodeBox promoCode={promoCode} as="a" href={`promoCodes/${promoCode.id}`} />)}
        </Masonry>
      </ResponsiveMasonry>
    </Page>
  );
}

export async function getServerSideProps({ req, res, query: { event: eventId } }) {
  const session = await getSession({ req });
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const eventResults = await fetch(getEventWithPromoCodesQuery, { data: { id: eventId } });
  const event = eventResults?.clear?.event;
  if (!event) {
    return {
      redirect: {
        destination: `/events`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      event,
    },
  };
}
