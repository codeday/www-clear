import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box, Button, Checkbox, Heading, Text,
} from '@codeday/topo/Atom';
import { UiEdit } from '@codeday/topocons';
import { Modal } from 'react-responsive-modal';
import { print } from 'graphql';
import { useToasts } from '@codeday/topo/utils';
import { useSession } from 'next-auth/react';
import { useColorModeValue } from '@codeday/topo/Theme';
import { useFetcher } from '../fetch';
import { UpdateEventRestrictionsMutation } from './LinkEventRestrictionsModal.gql';

export default function LinkEventRestrictionsModal({
  event, restrictions, requiredRestrictions, children, ...props
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const { success, error } = useToasts();
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const [formData, setFormData] = useState(restrictions.reduce((prev, curr) => ({
    ...prev,
    [curr.id]: (
      (event.cmsEventRestrictions || []).filter((restriction) => restriction.id === curr.id).length > 0
                && (requiredRestrictions || []).filter((restriction) => restriction.id === curr.id).length <= 0
    ),
  }), {}));

  const router = useRouter();
  return (
    <Box display="inline" {...props}>
      <Button display="inline" onClick={onOpenModal}>{children || <UiEdit />}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Heading m={2} mb={0}>
          Event Restrictions for {event.name}
        </Heading>
        <Text mb={2}>(Red checkmarks are required for your location and cannot be disabled.)</Text>
        {restrictions.map((r) => (
          <Checkbox
            display="block"
            isChecked={formData[r.id]}
            isReadOnly={requiredRestrictions.filter((rq) => rq.id === r.id).length > 0}
            isRequired={requiredRestrictions.filter((rq) => rq.id === r.id).length > 0}
            onChange={(e) => { setFormData({ ...formData, [r.id]: !formData[r.id] }); }}
            disabled={requiredRestrictions.filter((rq) => rq.id === r.id).length > 0}
            colorScheme={requiredRestrictions.filter((rq) => rq.id === r.id).length > 0 ? 'red' : 'blue'}
          >
            {r.name}
          </Checkbox>
        ))}
        <Button
          disabled={loading}
          isLoading={loading}
          onClick={async () => {
            try {
              // I absolutely hate this, there has to be a cleaner solution
              const setQuery = restrictions.filter((r) => (formData[r.id]));
              setQuery.forEach((r, idx) => Object.keys(r).forEach((i) => { if (i !== 'id') delete setQuery[idx][i]; }));
              await fetch(
                print(UpdateEventRestrictionsMutation),
                {
                  where: { id: event.id },
                  restrictions: { set: setQuery.map((e) => e.id) },
                },
              );
              await router.replace(router.asPath);
              success('Event Restrictions Updated!');
              onCloseModal();
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
        >
          Confirm
        </Button>
      </Modal>
    </Box>
  );
}
