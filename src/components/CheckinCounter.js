import {
  Box, Grid, Spinner, Text,
} from '@codeday/topo/Atom';
import useSwr from 'swr';
import { useFetcher } from '../fetch';
import { getCheckinCountsQuery } from './CheckinCounter.gql';

export default function CheckinCounter({ event, ...props }) {
  const fetch = useFetcher();
  const { data, isValidating } = useSwr([getCheckinCountsQuery, { data: { id: event.id } }], fetch, { revalidateOnFocus: true, refreshInterval: 15 * 1000 });

  if (!data?.clear?.event) return <></>;
  const {
    notCheckedInStudents, checkedInStudents, notCheckedInStaff, checkedInStaff, venue,
  } = data.clear.event;
  const total = notCheckedInStudents.length + checkedInStudents.length + notCheckedInStaff.length + checkedInStaff.length;
  const absoluteTotal = Math.max(total, venue?.capacity);
  if (!venue?.capacity || total < 5 || checkedInStudents === 0 || checkedInStaff === 0) return <></>;

  return (
    <Box {...props}>
      <Text fontSize="sm" textTransform="uppercase" fontWeight="bold">Here Now</Text>
      <Grid templateColumns="1fr 3em">
        <Box>
          <Box w="100%" textAlign="left">
            {(checkedInStudents.length > 0 || notCheckedInStudents.length > 0) && (
              <>
                <Box textAlign="center" borderWidth={1} borderColor="green.600" bgColor="green.600" display="inline-block" w={`${Math.floor((checkedInStudents.length / absoluteTotal) * 100)}%`}>{checkedInStudents.length}</Box>
                <Box textAlign="center" borderWidth={1} borderColor="green.100" bgColor="green.100" display="inline-block" w={`${Math.floor((notCheckedInStudents.length / absoluteTotal) * 100)}%`}>{notCheckedInStudents.length}</Box>
              </>
            )}
            {(checkedInStaff.length > 0 || notCheckedInStaff.length > 0) && (
              <>
                <Box textAlign="center" borderWidth={1} borderColor="red.600" bgColor="red.600" display="inline-block" w={`${Math.floor((checkedInStaff.length / absoluteTotal) * 100)}%`}>{checkedInStaff.length}</Box>
                <Box textAlign="center" borderWidth={1} borderColor="red.100" bgColor="red.100" display="inline-block" w={`${Math.floor((notCheckedInStaff.length / absoluteTotal) * 100)}%`}>{notCheckedInStaff.length}</Box>
              </>
            )}
            {venue.capacity > total && <Box textAlign="center" borderWidth={1} display="inline-block" w={`${(Math.floor((Math.max(0, venue.capacity - total) / venue.capacity) * 100)) - 2}%`}>{venue.capacity - total}</Box>}
          </Box>
          <Box w="100%" textTransform="lowercase" fontSize="sm">
            {(checkedInStudents.length > 0 || notCheckedInStudents.length > 0) && (
              <Box color="green.600" display="inline-block" w={`${((checkedInStudents.length + notCheckedInStudents.length) / absoluteTotal) * 100}%`}>
                Students ({Math.floor(checkedInStudents.length / (checkedInStudents.length + notCheckedInStudents.length) * 100)}% here)
              </Box>
            )}
            {(checkedInStaff.length > 0 || notCheckedInStaff.length > 0) && (
              <Box color="red.600" display="inline-block" w={`${((checkedInStaff.length + notCheckedInStaff.length) / absoluteTotal) * 100}%`}>
                Staff ({Math.floor(checkedInStaff.length / (checkedInStaff.length + notCheckedInStaff.length) * 100)}% here)
              </Box>
            )}
            {venue.capacity > total && <Box color="gray.600" display="inline-block">Open</Box>}
          </Box>
        </Box>
        <Box>{isValidating && <Spinner />}</Box>
      </Grid>
    </Box>
  );
}
