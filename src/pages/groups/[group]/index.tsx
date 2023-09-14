import React from 'react';

import { Box, Flex, Grid, Heading, Spinner } from '@codeday/topo/Atom';
import { useRouter } from 'next/router';
import { Page } from 'src/components/Page';
import { EventBox } from 'src/components/Event';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { CreateEvent } from 'src/components/forms/Event';
import { DeleteEventGroup, UpdateEventGroup } from 'src/components/forms/EventGroup';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import NotFound from 'src/pages/404';

const query = graphql(`
  query EventGroupPage($where: ClearEventGroupWhereUniqueInput!) {
    clear {
      eventGroup(where: $where) {
        id
        name
        events {
          id
        }
      }
    }
  }
`);

export default function Group() {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({ query, variables: { where: { id: router.query.group as string } } });

  const group = data?.clear?.eventGroup;
  if (group === null && !fetching) {
    return <NotFound />;
  }
  if (!group) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page title={group.name}>
      <Breadcrumbs group={group} />
      <Heading>
        {group.name} <UpdateEventGroup /> <DeleteEventGroup />
      </Heading>
      <Box display="inline-flex">
        <Heading m={4} size="md" display="inline-flex">
          <b>Events</b>
        </Heading>
        <CreateEvent />
      </Box>
      <Flex wrap="wrap">
        {group.events.map((event) => {
          return <EventBox event={event} />;
        })}
      </Flex>
    </Page>
  );
}
