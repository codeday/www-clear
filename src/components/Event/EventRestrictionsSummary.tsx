import React from 'react';
import { Box, Skeleton, Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEvent } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import { InfoBox, InfoBoxProps } from '../InfoBox';
import { InfoAlert } from '../Alert';
import { EventRestrictionPreview } from '../EventRestriction';
import { LinkEventRestrictions } from '../forms/LinkEventRestrictions';

const query = graphql(`
  query EventRestrictionsSummary($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        cmsEventRestrictions {
          id
          name
        }
        region {
          localizationConfig {
            id
            requiredEventRestrictions {
              items {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`);

type EventRestrictionsSummaryProps = {
  event: PropFor<ClearEvent>;
} & InfoBoxProps;

export function EventRestrictionSummary({ event: eventData, children, ...props }: EventRestrictionsSummaryProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: eventData.id } } });
  const event = data?.clear?.event;
  if (!event) return <Spinner />;
  const restrictions = [
    ...event.cmsEventRestrictions,
    ...(event.region?.localizationConfig?.requiredEventRestrictions?.items || []),
  ];
  console.log(restrictions);
  return (
    <InfoBox
      heading="Event Restrictions"
      buttons={<LinkEventRestrictions event={event} />}
      {...props}
    >
      <Box pl={4}>
        {restrictions.length > 0 ? (
          <Box>
            {restrictions.map(
              (r) =>
                r && (
                  <details>
                    <summary>{r.name}</summary>
                    <EventRestrictionPreview eventRestriction={r} />
                  </details>
                ),
            )}
          </Box>
        ) : (
          <InfoAlert>No Event restrictions</InfoAlert>
        )}
      </Box>
      {children}
    </InfoBox>
  );
}
