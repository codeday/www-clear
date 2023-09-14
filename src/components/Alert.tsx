import React from 'react';

import { UiError, UiInfo, UiOk, UiWarning } from '@codeday/topocons';
import { Badge, HStack, Text } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import { BadgeProps } from '@chakra-ui/react';

export function Alert({ children, ...props }: BadgeProps) {
  return (
    <Badge colorScheme="red" m={1} {...props}>
      <HStack>
        <UiError my="0.25em" />
        <Text>{children}</Text>
      </HStack>
    </Badge>
  );
}

export function InfoAlert({ children, ...props }: BadgeProps) {
  return (
    <Badge colorScheme="gray" {...props}>
      <UiInfo /> {children}
    </Badge>
  );
}

export function WarningAlert({ children, ...props }: BadgeProps) {
  return (
    <Badge colorScheme="orange" {...props}>
      <UiWarning /> {children}
    </Badge>
  );
}

export function GoodAlert({ children, ...props }: BadgeProps) {
  return (
    <Badge colorScheme="green" {...props}>
      <UiOk /> {children}
    </Badge>
  );
}
