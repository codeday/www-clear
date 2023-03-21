import React from 'react';
import { getServerSession } from 'next-auth/next';
import { Heading } from '@codeday/topo/Atom';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import { getFetcher } from '../../../../fetch';
import { GetPromoCodeQuery } from './promoCode.gql';
import Page from '../../../../components/Page';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { DeletePromoCodeModal, UpdatePromoCodeModal } from '../../../../components/forms/PromoCode';
import Notes from '../../../../components/forms/Notes';
import { SetPromoCodeNotesMutation } from '../../../../components/forms/Notes.gql';
import PromoCodeBox from '../../../../components/PromoCodeBox';
import Ticket from '../../../../components/Ticket';
import MetadataBox from '../../../../components/MetadataBox';

export default function PromoCode({ code }) {
  if (!code) return <></>;
  return (
    <>
      <Breadcrumbs event={code.event} code={code} />
      <Heading>Promo Code ~ {code.code} <UpdatePromoCodeModal promocode={code} /> <DeletePromoCodeModal promocode={code} /></Heading>
      <ResponsiveMasonry>
        <Masonry>
          <PromoCodeBox promoCode={code} heading="details" />
          <Notes notes={code.notes} updateId={code.id} updateMutation={SetPromoCodeNotesMutation} />
          <MetadataBox metadata={code.metadata} />
        </Masonry>
      </ResponsiveMasonry>
      Registrations using this code:
      <ResponsiveMasonry>
        <Masonry>
          {code.tickets.map((ticket) => <Ticket ticket={ticket} />)}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}

export async function getServerSideProps({ req, res, query: { event: eventId, promoCode: codeId } }) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const codeResults = await fetch(GetPromoCodeQuery, { data: { id: codeId } });
  const code = codeResults?.clear?.promoCode;
  if (!code) {
    return {
      redirect: {
        destination: `/events/${eventId}/promoCodes`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      title: 'Promo Code',
      code,
    },
  };
}
