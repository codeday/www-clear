import React from 'react';
import { Text, Heading, Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { ClearEvent } from 'generated/gql/graphql';
import { InfoBox, InfoBoxProps } from '../InfoBox';

const query = graphql(`
  query EventScheduleSummary($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        schedule {
          id
          finalized
          internal
        }
      }
    }
  }
`);

export type EventScheduleSummaryProps = {
  event: PropFor<ClearEvent>;
} & InfoBoxProps;

export function EventScheduleSummary({ event: eventData, children, ...props }: EventScheduleSummaryProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: eventData.id } } });
  const event = data?.clear?.event;
  if (!event) return <Spinner />;
  const finalizedExternalEvents = event.schedule.filter((s) => s.finalized && !s.internal).length;
  const nonfinalizedExternalEvents = event.schedule.filter((s) => !s.finalized && !s.internal).length;
  const internalEvents = event.schedule.filter((s) => s.internal).length;
  return (
    <InfoBox heading="Schedule" headingSize="xl" {...props}>
      <Text>
        <Heading display="inline" color="green">
          {finalizedExternalEvents}
        </Heading>{' '}
        Published Events
      </Text>
      <Text>
        <Heading display="inline" color="orange">
          {nonfinalizedExternalEvents}
        </Heading>{' '}
        Unpublished Events
      </Text>
      <Text>
        <Heading display="inline" color="purple">
          {internalEvents}
        </Heading>{' '}
        Internal Events
      </Text>
      {children}
    </InfoBox>
  );
}
