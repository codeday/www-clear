import React from 'react';
import { Box, Heading } from '@codeday/topo/Atom';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import EventGroup from '../../components/EventGroup';
import { getEventGroups } from './index.gql';
import Page from '../../components/Page';
import { getFetcher } from '../../fetch';
import { CreateEventGroupModal } from '../../components/forms/EventGroup';

export default function Groups({ groups }) {
  if (!groups) return <></>;
  return (
    <>
      <Heading>
        Event Groups
        <CreateEventGroupModal />
      </Heading>
      <Box display="flex">
        {groups.map((group) => (
          <EventGroup m={4} group={group} />
        ))}
      </Box>
    </>

  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const fetch = getFetcher(session);
  if (!session) return { props: {} };

  const groupsResult = await fetch(getEventGroups);

  return {
    props: {
      title: 'Event Groups',
      groups: groupsResult.clear.eventGroups,
    },
  };
}
