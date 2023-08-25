import React from 'react';
import { Skeleton, Text } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEventGroup } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import { InfoBox } from '../InfoBox';

const query = graphql(`
  query EventGroupBox($where: ClearEventGroupWhereUniqueInput!) {
    clear {
      eventGroup(where: $where) {
        id
        name
        displayDate
        events {
          id
        }
      }
    }
  }
`);

export type EventGroupBoxProps = {
  group: PropFor<ClearEventGroup>;
};

export function EventGroupBox({ group: groupData, ...props }: EventGroupBoxProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: groupData.id } } });
  const group = data?.clear?.eventGroup;
  if (!group) return <Skeleton />;
  return (
    <InfoBox heading={group.name} as="a" href={`groups/${group.id}`}>
      <Text>{group.displayDate}</Text>
      <Text>{group.events.length} Events</Text>
    </InfoBox>
  );
}
