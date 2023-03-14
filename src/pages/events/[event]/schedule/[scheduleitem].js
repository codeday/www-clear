import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Heading, Link } from '@codeday/topo/Atom';
import { Email, IdCard } from '@codeday/topocons';
import { getSession } from 'next-auth/react';
import { getFetcher } from '../../../../fetch';
import { GetScheduleItemQuery } from './scheduleitem.gql';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import Page from '../../../../components/Page';
import InfoBox from '../../../../components/InfoBox';
import { DeleteScheduleItemModal, UpdateScheduleItemModal } from '../../../../components/forms/ScheduleItem';
import ContactBox from '../../../../components/ContactBox';
import { SetScheduleItemNotesMutation } from '../../../../components/forms/Notes.gql';
import Notes from '../../../../components/forms/Notes';

export default function ScheduleItem({ scheduleitem }) {
  if (!scheduleitem) return <Page />;
  return (
    <Page title={scheduleitem.name}>
      <Breadcrumbs event={scheduleitem.event} scheduleitem={scheduleitem} />
      <Heading>
        {scheduleitem.type ? `${scheduleitem.type}: ` : null} {scheduleitem.name}
        <UpdateScheduleItemModal scheduleitem={scheduleitem} />
        <DeleteScheduleItemModal scheduleitem={scheduleitem} />
      </Heading>
      <Heading size="md">
        {scheduleitem.displayTimeWithDate}
      </Heading>
      <Link>{scheduleitem.link}</Link>
      <ResponsiveMasonry>
        <Masonry>
          <InfoBox heading="Description">
            {scheduleitem.description}
          </InfoBox>
          <InfoBox heading="Host">
            <IdCard />{scheduleitem.hostName} ({scheduleitem.hostPronoun}) <br />
            <Email />{scheduleitem.hostEmail}
          </InfoBox>
          <InfoBox heading="Internal">
            <ContactBox
              heading="Organizer"
              name={scheduleitem.organizerName}
              email={scheduleitem.organizerEmail}
              phone={scheduleitem.organizerPhone}
            />
            <Notes
              notes={scheduleitem.notes}
              updateId={scheduleitem.id}
              updateMutation={SetScheduleItemNotesMutation}
            />
          </InfoBox>
        </Masonry>
      </ResponsiveMasonry>
    </Page>
  );
}

export async function getServerSideProps({ req, res, query: { scheduleitem: itemId } }) {
  const session = await getSession({ req });
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const scheduleitemResults = await fetch(GetScheduleItemQuery, { data: { id: itemId } });
  return {
    props: {
      scheduleitem: scheduleitemResults.clear.scheduleItem,
    },
  };
}
