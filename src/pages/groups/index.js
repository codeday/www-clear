import React from 'react';
import { Box, Heading } from '@codeday/topo/Atom';
import { getSession } from 'next-auth/react';
import EventGroup from '../../components/EventGroup';
import { getEventGroups } from './index.gql';
import Page from '../../components/Page';
import { getFetcher } from '../../fetch';
import { CreateEventGroupModal } from '../../components/forms/EventGroup';

export default function Groups({ groups }) {
  if (!groups) return <Page />;
  return (
    <Page title="Event Groups">
      <Heading>
        Event Groups
        <CreateEventGroupModal />
      </Heading>
      <Box display="flex">
        {groups.map((group) => (
          <EventGroup m={4} group={group} />
        ))}
      </Box>
    </Page>

  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  const fetch = getFetcher(session);
  if (!session) return { props: {} };

  const groupsResult = await fetch(getEventGroups);

  return {
    props: {
      groups: groupsResult.clear.eventGroups,
    },
  };
}
