import { useInterval } from '@chakra-ui/react';
import { Box, Grid, Text } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEvent } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import { InfoBoxProps } from '../InfoBox';

const query = graphql(`
  query EventCheckInCounter($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        venue {
          id
          capacity
        }
        tickets {
          id
          type
          checkedIn
          checkedOut
        }
      }
    }
  }
`);

export type EventCheckInCounterProps = {
  event: PropFor<ClearEvent>;
} & InfoBoxProps;

export function EventCheckinCounter({ event: eventData, ...props }: EventCheckInCounterProps) {
  const [{ data }, refresh] = useQuery({
    query,
    variables: { where: { id: eventData.id } },
    requestPolicy: 'cache-and-network',
  });

  // TODO: Use subscriptions for this instead
  useInterval(() => refresh({ requestPolicy: 'network-only' }), 1000 * 15);
  const event = data?.clear?.event;
  if (!event || !event.venue?.capacity) return <></>;

  const checkedInStudents = event.tickets.filter((t) => t.type === 'STUDENT' && t.checkedIn).length;
  const notCheckedInStudents = event.tickets.filter((t) => t.type === 'STUDENT' && !t.checkedIn).length;
  const checkedInStaff = event.tickets.filter((t) => t.type !== 'STUDENT' && t.checkedIn).length;
  const notCheckedInStaff = event.tickets.filter((t) => t.type !== 'STUDENT' && !t.checkedIn).length;

  const absoluteTotal = Math.max(event.tickets.length, event.venue.capacity);
  if (event.tickets.length < 5 || checkedInStudents === 0 || checkedInStaff === 0) return <></>;

  return (
    <Box {...props}>
      <Text fontSize="sm" textTransform="uppercase" fontWeight="bold">
        Here Now
      </Text>
      <Grid templateColumns="1fr 3em">
        <Box>
          <Box w="100%" textAlign="left">
            {(checkedInStudents > 0 || notCheckedInStudents > 0) && (
              <>
                <Box
                  textAlign="center"
                  borderWidth={1}
                  borderColor="green.600"
                  bgColor="green.600"
                  display="inline-block"
                  w={`${Math.floor((checkedInStudents / absoluteTotal) * 100)}%`}
                >
                  {checkedInStudents}
                </Box>
                <Box
                  textAlign="center"
                  borderWidth={1}
                  borderColor="green.100"
                  bgColor="green.100"
                  display="inline-block"
                  w={`${Math.floor((notCheckedInStudents / absoluteTotal) * 100)}%`}
                >
                  {notCheckedInStudents}
                </Box>
              </>
            )}
            {(checkedInStaff > 0 || notCheckedInStaff > 0) && (
              <>
                <Box
                  textAlign="center"
                  borderWidth={1}
                  borderColor="red.600"
                  bgColor="red.600"
                  display="inline-block"
                  w={`${Math.floor((checkedInStaff / absoluteTotal) * 100)}%`}
                >
                  {checkedInStaff}
                </Box>
                <Box
                  textAlign="center"
                  borderWidth={1}
                  borderColor="red.100"
                  bgColor="red.100"
                  display="inline-block"
                  w={`${Math.floor((notCheckedInStaff / absoluteTotal) * 100)}%`}
                >
                  {notCheckedInStaff}
                </Box>
              </>
            )}
            {event.venue.capacity > event.tickets.length && (
              <Box
                textAlign="center"
                borderWidth={1}
                display="inline-block"
                w={`${
                  Math.floor((Math.max(0, event.venue.capacity - event.tickets.length) / event.venue.capacity) * 100) -
                  2
                }%`}
              >
                {event.venue.capacity - event.tickets.length}
              </Box>
            )}
          </Box>
          <Box w="100%" textTransform="lowercase" fontSize="sm">
            {(checkedInStudents > 0 || notCheckedInStudents > 0) && (
              <Box
                color="green.600"
                display="inline-block"
                w={`${((checkedInStudents + notCheckedInStudents) / absoluteTotal) * 100}%`}
              >
                Students ({Math.floor((checkedInStudents / (checkedInStudents + notCheckedInStudents)) * 100)}% here)
              </Box>
            )}
            {(checkedInStaff > 0 || notCheckedInStaff > 0) && (
              <Box
                color="red.600"
                display="inline-block"
                w={`${((checkedInStaff + notCheckedInStaff) / absoluteTotal) * 100}%`}
              >
                Staff ({Math.floor((checkedInStaff / (checkedInStaff + notCheckedInStaff)) * 100)}% here)
              </Box>
            )}
            {event.venue.capacity > event.tickets.length && (
              <Box color="gray.600" display="inline-block">
                Open
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}
