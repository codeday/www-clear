import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Textarea as TextareaInput } from '@codeday/topo/Atom';

import * as Icon from '@codeday/topocons';
import { useToasts } from '@codeday/topo/utils';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { graphql } from 'generated/gql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useMutation, useQuery, createRequest } from 'urql';
import { client } from 'src/urqlclient';
import { camelToTilte } from 'src/utils';
import { InfoBox, InfoBoxProps } from '../../InfoBox';
import { mutations } from './mutations';
import { queries } from './queries';

export type EditMetadataProps = {
  of:
    | {
        __typename: keyof typeof mutations & keyof typeof queries;
        id: string;
      }
    | undefined;
  mKey: string;
  name?: string;
  description?: string;
  placeholder?: string;
} & InfoBoxProps;

/**
 * Metadata editor for any key of any clear object
 *
 * @remarks
 * Don't forget to query __typename in the query where you fetch your `of` object!
 *
 * @example
 * Basic usage:
 * ```
 * <EditMetada of={event} mKey='notes' />
 * ```
 *
 * @param of - the object to perform this operation on.
 * @param mKey - the metadata key to edit
 * @param name - optional, defaults to `mKey`
 * @param description - optional, extra description shown under the heading
 * @param placeholder - optional, sets placeholder for text input
 */

export function EditMetadata({ mKey: key, of, name, description, placeholder, children, ...props }: EditMetadataProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const { error } = useToasts();
  const [value, setValue] = useState('');
  useEffect(() => {
    if (of !== undefined) {
      const req = client.query(queries[of.__typename], { key, where: { id: of.id } });
      req.then((r) => {
        const result = r.data?.clear;
        // @ts-ignore
        setValue(result[Object.keys(result)[0]].getMetadata || '');
      });
    }
  }, [of, key]);
  const okButton = (
    <Button
      h={6}
      disabled={loading}
      isLoading={loading}
      onClick={async () => {
        if (!of) return error('of is undefined!');
        setLoading(true);
        const m = await client.mutation(mutations[of.__typename], { key, value: tempValue, where: { id: of.id } });
        if (m.error) {
          error(m.error.name, m.error.message);
        } else {
          const result = m.data?.clear;
          // @ts-ignore
          setValue(result[Object.keys(result)[0]].getMetadata);
          setEditing(false); // wait to set editing until after request, so that in case of failure no data is lost
        }
        setLoading(false);
      }}
    >
      <Icon.UiOk />
    </Button>
  );
  const trashButton = (
    <Button
      h={6}
      onClick={() => {
        setEditing(false);
      }}
    >
      <Icon.UiX />
    </Button>
  );
  const editButton = (
    <Button
      h={6}
      onClick={() => {
        setEditing(true);
        setTempValue(value);
      }}
    >
      <Icon.UiEdit />
    </Button>
  );
  const buttons = editing ? (
    <Box>
      {okButton} {trashButton}
    </Box>
  ) : (
    editButton
  );
  return (
    <InfoBox w="xs" heading={name || camelToTilte(key)} subHeading={description} buttons={buttons} mb={4} {...props}>
      <Box p={1}>
        {editing ? (
          <TextareaInput  value={tempValue} onChange={(e) => setTempValue(e.target.value)} placeholder={placeholder} />
        ) : (
          value.split('\n').map((val) => <Text>{val}</Text>)
        )}
        {children}
      </Box>
    </InfoBox>
  );
}
