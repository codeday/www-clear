import React from 'react';
import { Text, Skeleton } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { ClearEvent } from 'generated/gql/graphql';
import { InfoBox, InfoBoxProps } from '../InfoBox';

const query = graphql(`
  query EventDaysUntil($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        startDate
      }
    }
  }
`);

type DayDisplayProps = Partial<{
  text: string;
  redText: string;
}> &
  InfoBoxProps;

function DayDisplay({ text, redText, children, ...props }: DayDisplayProps) {
  return (
    <InfoBox {...props}>
      <Text mb={0} fontSize="3xl" fontWeight="bold">
        {text}
        {text && redText && <>&nbsp;</>}
        {redText && (
          <Text as="span" color="brand">
            {redText}
          </Text>
        )}
      </Text>
      {children}
    </InfoBox>
  );
}

type EventDaysUntilProps = {
  event: PropFor<ClearEvent>;
} & DayDisplayProps;

export function EventDaysUntil({ event: eventData, ...props }: EventDaysUntilProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: eventData.id } } });
  const event = data?.clear?.event;
  const daysUntil = event?.startDate.diffNow('days').as('days');

  if (!daysUntil) {
    return (
      <Skeleton>
        <DayDisplay text="loading" />
      </Skeleton>
    );
  }
  if (daysUntil < 0) return <DayDisplay text="CodeDay is over. :(" {...props} />;
  if (daysUntil === 0) return <DayDisplay redText="It's CodeDay!" {...props} />;
  if (daysUntil === 1) return <DayDisplay text="CodeDay is" redText="tomorrow." {...props} />;
  return <DayDisplay text="CodeDay is" redText={`in ${daysUntil.toFixed(0)} days.`} {...props} />;
}
