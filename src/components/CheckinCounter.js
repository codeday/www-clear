import { Box, Grid, Spinner, Text } from '@codeday/topo/Atom';
import { useFetcher } from '../fetch';
import useSwr from 'swr';
import { getCheckinCountsQuery } from './CheckinCounter.gql';

export default function CheckinCounter({ event, ...props }) {
  const fetch = useFetcher();
  const { data, isValidating } = useSwr([getCheckinCountsQuery, { data: { id: event.id } }], fetch, { revalidateOnFocus: true, refreshInterval: 15*1000 });

  if (!data?.clear?.event) return <></>;
  const { notCheckedInStudents, checkedInStudents, notCheckedInStaff, checkedInStaff, venue } = data.clear.event;
  const total = notCheckedInStudents.length + checkedInStudents.length + notCheckedInStaff.length + checkedInStaff.length;
  const absoluteTotal = Math.max(total, venue.capacity);
  if (!venue?.capacity || total < 5 || checkedInStudents === 0 || checkedInStaff === 0) return <></>;

  return (
    <Box {...props}>
      <Text fontSize="sm" textTransform="uppercase" fontWeight="bold">Here Now</Text>
      <Grid templateColumns="1fr 3em">
        <Box>
          <Box w="100%" textAlign="center">
            <Box borderWidth={1} borderColor="green.600" bgColor="green.600" display="inline-block" w={`${(checkedInStudents.length/absoluteTotal)*100}%`}>{checkedInStudents.length}</Box>
            <Box borderWidth={1} borderColor="green.100" bgColor="green.100" display="inline-block" w={`${(notCheckedInStudents.length/absoluteTotal)*100}%`}>{notCheckedInStudents.length}</Box>
            <Box borderWidth={1} borderColor="red.600" bgColor="red.600" display="inline-block" w={`${(checkedInStaff.length/absoluteTotal)*100}%`}>{checkedInStaff.length}</Box>
            <Box borderWidth={1} borderColor="red.100" bgColor="red.100" display="inline-block" w={`${(notCheckedInStaff.length/absoluteTotal)*100}%`}>{notCheckedInStaff.length}</Box>
            {venue.capacity > total && <Box borderWidth={1} display="inline-block" w={`${(Math.max(0, venue.capacity - total)/venue.capacity) * 100}%`}>{venue.capacity - total}</Box>}
          </Box>
          <Box w="100%" textTransform="lowercase" fontSize="sm">
            <Box color="green.600" display="inline-block" w={`${((checkedInStudents.length + notCheckedInStudents.length)/absoluteTotal)*100}%`}>Students</Box>
            <Box color="red.600" display="inline-block" w={`${((checkedInStaff.length + notCheckedInStaff.length)/absoluteTotal)*100}%`}>Staff</Box>
            <Box color="gray.600" display="inline-block">Open</Box>
          </Box>
        </Box>
        <Box>{isValidating && <Spinner />}</Box>
      </Grid>
    </Box>
  );
}