import { Box, Grid, Spinner, Text } from '@codeday/topo/Atom';
import { useFetcher } from '../fetch';
import useSwr from 'swr';

// @ts-expect-error TS(2307) FIXME: Cannot find module './CheckinCounter.gql' or its c... Remove this comment to see the full error message
import { getCheckinCountsQuery } from './CheckinCounter.gql';

export default function CheckinCounter({
  event,
  ...props
}: any) {

  // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 0.
  const fetch = useFetcher();
  const { data, isValidating } = useSwr([getCheckinCountsQuery, { data: { id: event.id } }], fetch, { revalidateOnFocus: true, refreshInterval: 15*1000 });

  if (!data?.clear?.event) return <></>;
  const { notCheckedInStudents, checkedInStudents, notCheckedInStaff, checkedInStaff, venue } = data.clear.event;
  const total = notCheckedInStudents.length + checkedInStudents.length + notCheckedInStaff.length + checkedInStaff.length;
  const absoluteTotal = Math.max(total, venue.capacity);
  if (!venue?.capacity || total < 5 || checkedInStudents === 0 || checkedInStaff === 0) return <></>;


  // @ts-expect-error TS(2364) FIXME: The left-hand side of an assignment expression mus... Remove this comment to see the full error message
  return (

    // @ts-expect-error TS(2749) FIXME: 'Box' refers to a value, but is being used as a ty... Remove this comment to see the full error message
    <Box {...props}>

      // @ts-expect-error TS(2304) FIXME: Cannot find name 'fontSize'.
      <Text fontSize="sm" textTransform="uppercase" fontWeight="bold">Here Now</Text>

      // @ts-expect-error TS(2304) FIXME: Cannot find name 'templateColumns'.
      <Grid templateColumns="1fr 3em">

        // @ts-expect-error TS(2749) FIXME: 'Box' refers to a value, but is being used as a ty... Remove this comment to see the full error message
        <Box>

          // @ts-expect-error TS(2749) FIXME: 'Box' refers to a value, but is being used as a ty... Remove this comment to see the full error message
          <Box w="100%" textAlign="left">

            // @ts-expect-error TS(2349) FIXME: This expression is not callable.
            {(checkedInStudents.length > 0 || notCheckedInStudents.length > 0) && (
              <>

                // @ts-expect-error TS(2749) FIXME: 'Box' refers to a value, but is being used as a ty... Remove this comment to see the full error message
                <Box textAlign="center" borderWidth={1} borderColor="green.600" bgColor="green.600" display="inline-block" w={`${Math.floor((checkedInStudents.length/absoluteTotal)*100)}%`}>{checkedInStudents.length}</Box>

                // @ts-expect-error TS(2304) FIXME: Cannot find name 'textAlign'.
                <Box textAlign="center" borderWidth={1} borderColor="green.100" bgColor="green.100" display="inline-block" w={`${Math.floor((notCheckedInStudents.length/absoluteTotal)*100)}%`}>{notCheckedInStudents.length}</Box>
              </>
            )}

            // @ts-expect-error TS(2304) FIXME: Cannot find name 'checkedInStaff'.
            {(checkedInStaff.length > 0 || notCheckedInStaff.length > 0) && (
              <>

                // @ts-expect-error TS(2749) FIXME: 'Box' refers to a value, but is being used as a ty... Remove this comment to see the full error message
                <Box textAlign="center" borderWidth={1} borderColor="red.600" bgColor="red.600" display="inline-block" w={`${Math.floor((checkedInStaff.length/absoluteTotal)*100)}%`}>{checkedInStaff.length}</Box>

                // @ts-expect-error TS(2304) FIXME: Cannot find name 'textAlign'.
                <Box textAlign="center" borderWidth={1} borderColor="red.100" bgColor="red.100" display="inline-block" w={`${Math.floor((notCheckedInStaff.length/absoluteTotal)*100)}%`}>{notCheckedInStaff.length}</Box>
              </>
            )}

            // @ts-expect-error TS(2304) FIXME: Cannot find name 'venue'.
            {venue.capacity > total && <Box textAlign="center" borderWidth={1} display="inline-block" w={`${(Math.floor((Math.max(0, venue.capacity - total)/venue.capacity) * 100)) - 2}%`}>{venue.capacity - total}</Box>}
          </Box>

          // @ts-expect-error TS(2304) FIXME: Cannot find name 'w'.
          <Box w="100%" textTransform="lowercase" fontSize="sm">

            // @ts-expect-error TS(2349) FIXME: This expression is not callable.
            {(checkedInStudents.length > 0 || notCheckedInStudents.length > 0) && (

              // @ts-expect-error TS(2749) FIXME: 'Box' refers to a value, but is being used as a ty... Remove this comment to see the full error message
              <Box color="green.600" display="inline-block" w={`${((checkedInStudents.length + notCheckedInStudents.length)/absoluteTotal)*100}%`}>

                // @ts-expect-error TS(2304) FIXME: Cannot find name 'Students'.
                Students ({Math.floor(checkedInStudents.length/(checkedInStudents.length + notCheckedInStudents.length) * 100)}% here)
              </Box>
            )}

            // @ts-expect-error TS(2304) FIXME: Cannot find name 'checkedInStaff'.
            {(checkedInStaff.length > 0 || notCheckedInStaff.length > 0) && (

              // @ts-expect-error TS(2749) FIXME: 'Box' refers to a value, but is being used as a ty... Remove this comment to see the full error message
              <Box color="red.600" display="inline-block" w={`${((checkedInStaff.length + notCheckedInStaff.length)/absoluteTotal)*100}%`}>

                // @ts-expect-error TS(2304) FIXME: Cannot find name 'Staff'.
                Staff ({Math.floor(checkedInStaff.length/(checkedInStaff.length + notCheckedInStaff.length) * 100)}% here)
              </Box>
            )}

            // @ts-expect-error TS(2304) FIXME: Cannot find name 'venue'.
            {venue.capacity > total && <Box color="gray.600" display="inline-block">Open</Box>}
          </Box>
        </Box>

        // @ts-expect-error TS(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
        <Box>{isValidating && <Spinner />}</Box>
      </Grid>
    </Box>
  );
}