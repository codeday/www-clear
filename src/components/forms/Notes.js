import React, { useState } from 'react';
import {
  Box, Button, Text, Textarea as TextareaInput,
} from '@codeday/topo/Atom';
import { UiEdit, UiOk, UiX } from '@codeday/topocons';
import { useToasts } from '@codeday/topo/utils';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useFetcher } from '../../fetch';
import InfoBox from '../InfoBox';

export default function Notes({
  notes, updateMutation, updateId, children, ...props
}) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempNotes, setTempNotes] = useState(notes); // Temporary notes while the user is editing
  const { success, error } = useToasts();
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const router = useRouter();

  const okButton = (
    <Button
      h={6}
      disabled={loading}
      isLoading={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await fetch(updateMutation, { notes: tempNotes || '', id: updateId });
          await router.replace(router.asPath); // kind of clunky solution to refresh serverSideProps after update; https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
          setEditing(false); // wait to set editing until after request, so that in case of failure no data is lost
        } catch (ex) {
          error(ex.toString());
        }
        setLoading(false);
      }}
    ><UiOk />
    </Button>
  );
  const trashButton = (
    <Button
      h={6}
      onClick={() => {
        setEditing(false);
      }}
    ><UiX />
    </Button>
  );
  const editButton = (
    <Button
      h={6}
      onClick={() => {
        setEditing(true);
        setTempNotes(notes);
      }}
    ><UiEdit />
    </Button>
  );
  const buttons = editing ? <Box>{okButton} {trashButton}</Box> : editButton;
  return (
    <InfoBox heading="Notes" buttons={buttons} {...props}>
      {editing
        ? (
          <TextareaInput
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
          />
        )
        : notes?.split('\n').map((val) => <Text>{val}</Text>)}
      {children}
    </InfoBox>
  );
}
