import React from 'react';
import { Box, Heading, Spinner } from '@codeday/topo/Atom';
import { useRouter } from 'next/router';
import { useQuery } from 'urql';
import { graphql } from 'generated/gql';
import NotFound from 'src/pages/404';
import { Page } from '../../../../components/Page';

import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { EventCalendar } from '../../../../components/Event';
import { CreateScheduleItem } from '../../../../components/forms/ScheduleItem';

const query = graphql(`
  query EventSchedulePage($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        name
      }
    }
  }
`);

export default function Schedule() {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({ query, variables: { where: { id: router.query.event as string } } });
  const event = data?.clear?.event;

  if (event === null && !fetching) {
    return <NotFound />;
  }
  if (!event) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page title={event.name}>
      <Breadcrumbs event={event} />
      <Heading>
        {event.name} - Schedule <CreateScheduleItem />{' '}
      </Heading>
      <Box display="inline-block">
        <EventCalendar event={event} />
      </Box>
    </Page>
  );
}
