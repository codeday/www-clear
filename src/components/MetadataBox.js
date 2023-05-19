import { Box, List, Text, ListItem } from '@codeday/topo/Atom';
import InfoBox from "./InfoBox";

function MetadataItem({ mKey, value, ...props }) {
  if (typeof value === 'undefined' || value === null) return (
    <ListItem {...props}>
        <Text fontFamily="mono" display="inline">null</Text>
    </ListItem>
  );
  return (
    <ListItem {...props}>
      {mKey && <Text fontWeight="bold" display="inline">{mKey}: </Text>}
      {typeof value === 'object'
        ? (
          <List pl={4} styleType="disc">
            {Object.keys(value).map((k) => <MetadataItem key={k} mKey={k} value={value[k]} />)}
          </List>
        ) : <Text fontFamily="mono" display="inline">{value}</Text>
      }
    </ListItem>
  );
}

export default function MetadataBox({ metadata, title, hideChangeNote, children, ...props }) {
    return (
        <InfoBox heading={title || 'Metadata'}>
            <List p={1}>
                <MetadataItem fontSize="xs" value={metadata} />
            </List>
            {children && !hideChangeNote ? children : (
              <Box mt={4} p={1} fontSize="sm" fontStyle="italic">
                Reach out to your CodeDay staff contact if you need to make changes to metadata.
              </Box>
            )}
        </InfoBox>
    );
}

