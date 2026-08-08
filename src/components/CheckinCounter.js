import { Box, Grid, Spinner, Text } from '@codeday/topo/Atom';
import { useFetcher } from '../fetch';
import useSwr from 'swr';
import { getCheckinCountsQuery } from './CheckinCounter.gql';

export default function CheckinCounter({ event, ...props }) {
  const fetch = useFetcher();
  const { data, isValidating } = useSwr([getCheckinCountsQuery, { data: { id: event.id } }], fetch, { revalidateOnFocus: true, refreshInterval: 15*1000 });

  if (!data || !data.clear || !data.clear.event) return <></>;
  const { notCheckedInStudents, checkedInStudents, notCheckedInStaff, checkedInStaff, venue } = data.clear.event;
  const total = notCheckedInStudents.length + checkedInStudents.length + notCheckedInStaff.length + checkedInStaff.length;
  const absoluteTotal = Math.max(total, venue.capacity);
  if (!venue?.capacity || total < 5 || checkedInStudents === 0 || checkedInStaff === 0) return <></>;

  return (
    <Box {...props}>
      <Text fontSize="sm" textTransform="uppercase" fontWeight="bold">Here Now</Text>
      <Grid templateColumns="">
        <Box w="full">
          <Box w="100%" textAlign="left" display="flex">
            {(checkedInStudents.length > 0 || notCheckedInStudents.length > 0) && (
              <>
                <Box textAlign="center" borderWidth={1} borderColor="green.600" bgColor="green.600" w={`${Math.floor((checkedInStudents.length/absoluteTotal)*100)}%`}>{checkedInStudents.length}</Box>
                <Box textAlign="center" borderWidth={1} borderColor="green.100" bgColor="green.100" w={`${Math.floor((notCheckedInStudents.length/absoluteTotal)*100)}%`}>{notCheckedInStudents.length}</Box>
              </>
            )}
            {venue.capacity > total && <Box textAlign="center" borderWidth={1} w={`${Math.floor((Math.max(0, venue.capacity - total)/absoluteTotal)*100)}%`}>{venue.capacity - total}</Box>}
          </Box>
          <Box w="100%" textTransform="lowercase" fontSize="xs" textAlign="center">
            {(checkedInStudents.length > 0 || notCheckedInStudents.length > 0) && (
              <Box w="100%" display="flex">
                <Box flex={`0 0 ${Math.floor((checkedInStudents.length/absoluteTotal)*100)}%`} color="green.600" textAlign="center">
                  Students ({Math.floor(checkedInStudents.length/(checkedInStudents.length + notCheckedInStudents.length) * 100)}% here)
                </Box>
                <Box flex={`0 0 ${Math.floor((notCheckedInStudents.length/absoluteTotal)*100)}%`} color="green.600" textAlign="center">
                  signed up ({Math.floor(notCheckedInStudents.length/(checkedInStudents.length + notCheckedInStudents.length) * 100)}% not here)
                </Box>
                {venue.capacity > total && <Box flex="1" color="gray.600" textAlign="center">
                  open ({100-Math.floor(((checkedInStudents.length + checkedInStaff.length + notCheckedInStudents.length + notCheckedInStaff.length) / venue.capacity)*100)}% of capacity)
                </Box>}
              </Box>
            )}
          </Box>
        </Box>
        <Box>{isValidating && <Spinner />}</Box>
      </Grid>
    </Box>
  );
}