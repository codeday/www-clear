import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Checkbox, Heading, Spinner, Text } from '@codeday/topo/Atom';

import { UiEdit } from '@codeday/topocons';

import { useDisclosure, useToasts } from '@codeday/topo/utils';
import { useColorModeValue } from '@codeday/topo/Theme';
import { graphql } from 'generated/gql';
import { ClearEvent } from 'generated/gql/graphql';
import { useMutation, useQuery } from 'urql';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Page } from '../Page';

const query = graphql(`
  query EventForRestrictionsUpdate($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        name
        contentfulEventRestrictions
        region {
          localizationConfig {
            id
            requiredEventRestrictions {
              items {
                id
              }
            }
          }
        }
      }
    }
    cms {
      eventRestrictions {
        items {
          id
          name
        }
      }
    }
  }
`);

const linkEventRestrictionsMutation = graphql(`
  mutation LinkEventRestrictions($where: ClearEventWhereUniqueInput!, $data: ClearEventUpdateInput!) {
    clear {
      updateEvent(where: $where, data: $data) {
        id
        cmsEventRestrictions {
          id
        }
      }
    }
  }
`);

export type LinkEventRestrictionsProps = {
  event: PropFor<ClearEvent>;
};
// This does not use the form system because we want a custom UI
export function LinkEventRestrictions({ event: eventData }: LinkEventRestrictionsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data }] = useQuery({ query, variables: { where: { id: eventData.id } } });
  const [linkEventRestrictionsResult, doLinkEventRestrictions] = useMutation(linkEventRestrictionsMutation);
  const { success, error } = useToasts();
  const [formData, setFormData] = useState<{ [key: string]: boolean }>({});
  const event = data?.clear?.event;
  const restrictions = data?.cms?.eventRestrictions?.items;

  useEffect(() => {
    if (!restrictions || !event) return;
    setFormData(
      restrictions.reduce((prev: { [key: string]: boolean }, curr) => {
        if (!curr) return prev;
        if (!curr.id) return prev;
        return {
          ...prev,
          [curr.id]:
            event.contentfulEventRestrictions.includes(curr.id) &&
            !(
              (event.region?.localizationConfig?.requiredEventRestrictions?.items || []).filter(
                (r) => r?.id === curr.id,
              ).length > 0
            ),
        };
      }, {}),
    );
  }, [event, restrictions]);

  if (!event || !restrictions) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  const requiredRestrictions = event.region?.localizationConfig?.requiredEventRestrictions?.items || [];
  return (
    <Box display="inline">
      <Button display="inline" h={6} onClick={onOpen}>
        <UiEdit />
      </Button>
      <Modal isOpen={isOpen} size="4xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading m={2} mb={0}>
              Event Restrictions for {event.name}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>(Red checkmarks are required for your location and cannot be disabled.)</Text>
            {restrictions.map((r) => (
              <Checkbox
                display="block"
                isChecked={formData[r?.id as string]}
                isReadOnly={requiredRestrictions.filter((rq) => rq?.id === r?.id).length > 0}
                isRequired={requiredRestrictions.filter((rq) => rq?.id === r?.id).length > 0}
                onChange={(e) => {
                  setFormData({ ...formData, [r?.id as string]: !formData[r?.id as string] });
                }}
                disabled={requiredRestrictions.filter((rq: any) => rq.id === r?.id).length > 0}
                colorScheme={requiredRestrictions.filter((rq: any) => rq.id === r?.id).length > 0 ? 'red' : 'blue'}
              >
                {r?.name}
              </Checkbox>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={linkEventRestrictionsResult.fetching}
              isLoading={linkEventRestrictionsResult.fetching}
              onClick={async () => {
                // I absolutely hate this, there has to be a cleaner solution
                const setQuery = restrictions.filter((r) => formData[r?.id as string]);
                setQuery.forEach((r, idx) =>
                  // @ts-ignore
                  Object.keys(r).forEach((i) => {
                    // @ts-ignore
                    if (i !== 'id') delete setQuery[idx][i];
                  }),
                );

                const res = await doLinkEventRestrictions({
                  where: { id: event.id },
                  data: { contentfulEventRestrictions: { set: setQuery.map((e) => e?.id as string) } },
                });
                if (res.error) {
                  error(res.error.name, res.error.message);
                } else {
                  success('Event Restrictions Updated!');
                }
                onClose();
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
