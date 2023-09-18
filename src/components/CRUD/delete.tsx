import { Box, Button, HStack } from '@codeday/topo/Atom';
import { UiTrash, UiX } from '@codeday/topocons';
import { VariablesOf } from '@graphql-typed-document-node/core';
import { OperationDefinitionNode } from 'graphql';
import React from 'react';
import { camelToTilte } from 'src/utils';
import { TypedDocumentNode, useMutation } from 'urql';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HeadingProps,
  ButtonProps,
} from '@chakra-ui/react';
import { useToasts } from '@codeday/topo/utils';

export type DeleteModalProps<T extends TypedDocumentNode<{}, { where: { id: string } }>> = {
  mutation: T;
  where: VariablesOf<T>['where'];
  onSubmit?: () => void;
  title?: string;
  body?: React.ReactNode;
  compact?: boolean;
  headingProps?: HeadingProps;
  buttonProps?: ButtonProps;
  doubleConfirm?: boolean;
};

export function DeleteModal({
  mutation,
  where,
  title: t,
  onSubmit,
  compact = false,
  body,
  headingProps,
  buttonProps,
  ...props
}: DeleteModalProps<TypedDocumentNode<{}, { where: { id: string } }>>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteResult, doDelete] = useMutation(mutation);
  const { success, error } = useToasts();
  const operation = mutation.definitions[0] as OperationDefinitionNode;
  const prettyOperationName = camelToTilte(
    operation.name?.value.replace(new RegExp(operation.operation, 'i'), '') || 'unknown',
  );
  const title = t || prettyOperationName;
  return (
    <Box display="inline" m={1} {...props}>
      <Button onClick={onOpen} {...buttonProps}>
        <>
          <UiTrash />
          {!compact && <>&nbsp;{title}</>}
        </>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader {...headingProps}>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {body || (
              <>
                Are you sure you want to <b>permanently delete</b> this {prettyOperationName.replace('Delete ', '')}?
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button
                isLoading={deleteResult.fetching}
                isDisabled={deleteResult.fetching}
                onClick={async () => {
                  const res = await doDelete({ where });
                  if (res.error) {
                    error(res.error.name, res.error.message);
                  } else {
                    success('Deleted!');
                    if (onSubmit) onSubmit();
                    onClose();
                  }
                }}
              >
                <UiTrash />
              </Button>
              <Button onClick={onClose}>
                <UiX />
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
