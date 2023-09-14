import { ListItemProps } from '@chakra-ui/react';
import { Box, List, Text, ListItem } from '@codeday/topo/Atom';
import { ClearJSON } from 'types/scalars';
import { InfoBox, InfoBoxProps } from './InfoBox';

type MetadataItemProps = {
  mValue: ClearJSON | string | undefined | null;
  mKey?: string;
} & ListItemProps;

function MetadataItem({ mKey, mValue, ...props }: MetadataItemProps) {
  if (mValue === undefined || mValue === null) {
    return (
      <ListItem {...props}>
        <Text fontFamily="mono" display="inline">
          null
        </Text>
      </ListItem>
    );
  }

  return (
    <ListItem {...props}>
      {mKey && (
        <Text fontWeight="bold" display="inline">
          {mKey}:{' '}
        </Text>
      )}
      {typeof mValue === 'object' ? (
        <List pl={4} styleType="disc">
          {Object.keys(mValue).map((k) => (
            <MetadataItem key={k} mKey={k} mValue={mValue[k]} />
          ))}
        </List>
      ) : (
        <Text fontFamily="mono" display="inline" overflowWrap="anywhere">
          {mValue}
        </Text>
      )}
    </ListItem>
  );
}

export type MetadataBoxProps = {
  metadata: ClearJSON | undefined | null;
  hideChangeNote?: boolean;
  showNotes?: boolean;
} & InfoBoxProps;

export function MetadataBox({
  metadata,
  hideChangeNote = false,
  showNotes = false,
  children,
  ...props
}: MetadataBoxProps) {
  const effectiveMetadata = { ...(metadata || {}) };
  if (!showNotes) {
    delete effectiveMetadata.notes;
  }
  return (
    <InfoBox heading="Metadata" {...props}>
      <List p={1}>
        <MetadataItem fontSize="xs" mValue={effectiveMetadata} />
      </List>
      {!hideChangeNote && (
        <Text mt={4} p={1} w="sm" fontSize="sm" fontStyle="italic">
          Reach out to your CodeDay staff contact if you need to make changes to metadata.
        </Text>
      )}
      {children}
    </InfoBox>
  );
}
