import React from 'react';
import { Heading, Text, Link, Button } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { Eye } from '@codeday/topocons';
import { ClearEvent } from 'generated/gql/graphql';
import { Spinner } from '@chakra-ui/react';
import { InfoBox, InfoBoxProps } from '../InfoBox';
import DocsCallout from '../DocsCallout';
import { CreateSponsor } from '../forms/Sponsor';

const query = graphql(`
  query EventSponsorSummary($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        sponsors {
          id
          amount
        }
        region {
          webname
          currencySymbol
        }
      }
    }
  }
`);

export type EventSponsorSummaryProps = {
  event: PropFor<ClearEvent>;
} & InfoBoxProps;

export function EventSponsorSummary({ event: eventData, children, ...props }: EventSponsorSummaryProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: eventData.id } } });
  const event = data?.clear?.event;
  if (!event) return <Spinner />;
  const total = event.sponsors.reduce((a, b) => a + b.amount, 0);
  return (
    <InfoBox
      heading="Sponsors"
      {...props}
      headingSize="xl"
      buttons={
        <>
          <Button h={6} as="a" href={`${event.id}/sponsors`}>
            <Eye />
          </Button>
          &nbsp;
          <CreateSponsor />
        </>
      }
    >
      <Heading p={4} textAlign="center" size="4xl" color="green.500">
        {event.region?.currencySymbol || '$'}
        {total}
      </Heading>
      <Text textAlign="center">raised from a total of {event.sponsors.length} sponsors</Text>
      {event.sponsors.length === 0 ? (
        <DocsCallout>
          Looking for help finding sponsors? Check out&nbsp;
          <Link
            color="brand"
            // eslint-disable-next-line no-secrets/no-secrets
            href="https://codeday.notion.site/searchSponsors-db-templates-perks-25c7ccf4f10d418da725b12433e4dd83"
          >
            this page
          </Link>
          &nbsp;in the CodeDay Organizer Guide!
        </DocsCallout>
      ) : null}
      {children}
    </InfoBox>
  );
}
