import { Box, List, Text, ListItem } from '@codeday/topo/Atom';
import InfoBox from "./InfoBox";

function MetadataItem({
  mKey,
  value,
  ...props
}: any) {

  // @ts-expect-error TS(2364) FIXME: The left-hand side of an assignment expression mus... Remove this comment to see the full error message
  if (typeof value === 'undefined' || value === null) return (

    // @ts-expect-error TS(2749) FIXME: 'ListItem' refers to a value, but is being used as... Remove this comment to see the full error message
    <ListItem {...props}>

        // @ts-expect-error TS(2304) FIXME: Cannot find name 'fontFamily'.
        <Text fontFamily="mono" display="inline">null</Text>
    </ListItem>
  );

  // @ts-expect-error TS(2364) FIXME: The left-hand side of an assignment expression mus... Remove this comment to see the full error message
  return (

    // @ts-expect-error TS(2749) FIXME: 'ListItem' refers to a value, but is being used as... Remove this comment to see the full error message
    <ListItem {...props}>

      // @ts-expect-error TS(2304) FIXME: Cannot find name 'fontWeight'.
      {mKey && <Text fontWeight="bold" display="inline">{mKey}: </Text>}
      {typeof value === 'object'
        ? (

          // @ts-expect-error TS(2749) FIXME: 'List' refers to a value, but is being used as a t... Remove this comment to see the full error message
          <List pl={4} styleType="disc">

            // @ts-expect-error TS(2749) FIXME: 'MetadataItem' refers to a value, but is being use... Remove this comment to see the full error message
            {Object.keys(value).map((k: any) => <MetadataItem key={k} mKey={k} value={value[k]} />)}
          </List>
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'fontFamily'.
        ) : <Text fontFamily="mono" display="inline">{value}</Text>
      }
    </ListItem>
  );
}

export default function MetadataBox({
  metadata,
  title,
  hideChangeNote,
  children,
  ...props
}: any) {
    return (

        // @ts-expect-error TS(2749) FIXME: 'InfoBox' refers to a value, but is being used as ... Remove this comment to see the full error message
        <InfoBox heading={title || 'Metadata'}>

            // @ts-expect-error TS(2749) FIXME: 'List' refers to a value, but is being used as a t... Remove this comment to see the full error message
            <List p={1}>

                // @ts-expect-error TS(2749) FIXME: 'MetadataItem' refers to a value, but is being use... Remove this comment to see the full error message
                <MetadataItem fontSize="xs" value={metadata} />
            </List>

            // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
            {children && !hideChangeNote ? children : (

              // @ts-expect-error TS(2749) FIXME: 'Box' refers to a value, but is being used as a ty... Remove this comment to see the full error message
              <Box mt={4} p={1} fontSize="sm" fontStyle="italic">

                // @ts-expect-error TS(2304) FIXME: Cannot find name 'Reach'.
                Reach out to your CodeDay staff contact if you need to make changes to metadata.
              </Box>
            )}
        </InfoBox>
    );
}

