import React from 'react';
import { Box, Flex, Text, Spinner } from '@codeday/topo/Atom';
import { Image } from '@chakra-ui/react';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { ClearEvent } from 'generated/gql/graphql';
import { InfoBox, InfoBoxProps } from '../InfoBox';

const query = graphql(`
  query EventBox($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        name
        endDate
        displayDate
        tickets {
          id
          type
        }
        eventGroup {
          id
          name
        }
        region {
          name
          skylinePhoto {
            url(transform: { width: 100, height: 100, resizeStrategy: FILL })
          }
        }
      }
    }
  }
`);

export type EventBoxProps = {
  event: PropFor<ClearEvent>;
} & InfoBoxProps;

export function EventBox({ event: eventData, ...props }: EventBoxProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: eventData.id } } });
  const event = data?.clear?.event;
  if (!event) return <Spinner />;

  const soldTicketsStudents = event.tickets.filter((t) => t.type === 'STUDENT');
  return (
    <InfoBox
      heading={
        <Text>
          <>
            {event.name} - {event.eventGroup.name}
          </>
        </Text>
      }
      id={event.id}
      as="a"
      href={`/events/${event.id}`}
      opacity={event.endDate.diffNow().milliseconds > 0 ? 0.5 : 1}
      {...props}
    >
      <Flex>
        <Box w="60px" h="60px" mr={4} mb={1} ml={1}>
          <Image
            src={
              event.region?.skylinePhoto?.url ? event.region.skylinePhoto.url : '/codeday-logo-skyline-substitute.png'
            }
            alt={`${event.region?.name || event.name} Skyline`}
            rounded={3}
          />
        </Box>
        <Box>
          <Text mb={0}>{event.displayDate}</Text>
          <Text mb={0}>{event.tickets.length + (event.tickets.length === 1 ? ' ticket' : ' tickets')} sold </Text>
          <Text mb={0}>
            ({soldTicketsStudents.length} students; {event.tickets.length - soldTicketsStudents.length} staff)
          </Text>
          <Text mb={0} />
        </Box>
      </Flex>
    </InfoBox>
  );
}
