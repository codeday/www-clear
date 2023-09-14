import React from 'react';
import { Flex, Heading, Spinner } from '@codeday/topo/Atom';

import { SponsorBox } from 'src/components/Sponsor';
import { Page } from 'src/components/Page';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { useRouter } from 'next/router';
import NotFound from 'src/pages/404';
import { CreateSponsor } from '../../../components/forms/Sponsor';

const query = graphql(`
  query EventSponsorsPage($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        name
        sponsors {
          id
        }
      }
    }
  }
`);

export default function EventSponsorsPage() {
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
    <Page title="Sponsors">
      <Breadcrumbs event={event} />
      <Heading>
        {event.name} sponsors <CreateSponsor event={event} />
      </Heading>
      <Flex>
        {event.sponsors.map((sponsor) => (
          <SponsorBox sponsor={sponsor} />
        ))}
      </Flex>
    </Page>
  );
}
