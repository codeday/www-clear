import React from 'react';
import { Box, Flex, Heading, Spinner } from '@codeday/topo/Atom';
import { EventGroupBox } from 'src/components/EventGroup';

import { Page } from 'src/components/Page';
import { CreateEventGroup } from 'src/components/forms/EventGroup';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';

const query = graphql(`
  query EventGroupsPage {
    clear {
      eventGroups(orderBy: { startDate: desc }) {
        id
      }
    }
  }
`);

export default function Groups() {
  const [{ data }] = useQuery({ query });

  const groups = data?.clear?.eventGroups;
  if (!groups) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page title="Event Groups">
      <Heading>
        Event Groups
        <CreateEventGroup />
      </Heading>
      <Flex flexWrap="wrap">
        {groups.map((group) => (
          <EventGroupBox group={group} flexShrink={0} />
        ))}
      </Flex>
    </Page>
  );
}
