import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Heading } from '@codeday/topo/Atom';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { EventRestrictionPreview } from '../../../components/EventRestriction';
import Page from '../../../components/Page';
import { getFetcher } from '../../../fetch';
import { GetEventRestrictionsQuery } from './eventRestrictions.gql';
import LinkEventRestrictionsModal from '../../../components/LinkEventRestrictionsModal';
import InfoBox from '../../../components/InfoBox';

export default function EventRestrictions({ event, restrictions }) {
  const requiredRestrictions = event?.region?.localizationConfig?.requiredEventRestrictions?.items || [];
  if (!event) return <></>;
  return (
    <>
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
    </>
  );
}

export async function getServerSideProps({ req, res, query: { event: eventId } }) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const eventResults = await fetch(GetEventRestrictionsQuery, { data: { id: eventId } });
  return {
    props: {
      event: eventResults.clear.event,
      restrictions: eventResults.cms.eventRestrictions,
      title: eventResults?.clear?.event?.name || 'Event Restrictions',
    },
  };
}
