import { List, Text, ListItem } from '@codeday/topo/Atom';
import InfoBox from "./InfoBox";

function MetadataItem({ mKey, value, ...props }) {
  return (
    <ListItem {...props}>
      {mKey && <Text fontWeight="bold" d="inline">{mKey}: </Text>}
      {typeof value === 'object'
        ? (
          <List pl={4} styleType="disc">
            {Object.keys(value).map((k) => <MetadataItem key={k} mKey={k} value={value[k]} />)}
          </List>
        ) : <Text fontFamily="mono" d="inline">{value}</Text>
      }
    </ListItem>
  );
}

export default function MetadataBox({ metadata, ...props }) {
    return (
        <InfoBox heading="Metadata">
            <List>
                <MetadataItem fontSize="xs" value={metadata} />
            </List>
        </InfoBox>
    );
}

