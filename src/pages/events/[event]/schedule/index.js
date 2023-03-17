import React from 'react';
import { Box, Heading } from '@codeday/topo/Atom';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import Page from '../../../../components/Page';
import { getEventWithSchedule } from './index.gql';
import { getFetcher } from '../../../../fetch';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import Calendar from '../../../../components/Calendar';
import { CreateScheduleItemModal } from '../../../../components/forms/ScheduleItem';

export default function Schedule({ event }) {
  if (!event) return <></>;
  return (
    <>
      <Breadcrumbs event={event} />
      <Heading>{event.name} - Schedule <CreateScheduleItemModal event={event} /> </Heading>
      <Box display="inline-block">
        <Calendar event={event} />
      </Box>
    </>
  );
}

export async function getServerSideProps({ req, res, query: { event: eventId } }) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const eventResults = await fetch(getEventWithSchedule, { data: { id: eventId } });
  return {
    props: {
      title: eventResults?.clear?.event?.name || 'Schedule',
      event: eventResults.clear.event,
    },
  };
}
