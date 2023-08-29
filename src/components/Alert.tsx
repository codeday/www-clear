import React from 'react';

import { UiError, UiInfo, UiOk, UiWarning } from '@codeday/topocons';
import { Badge } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import { BadgeProps } from '@chakra-ui/react';

export function Alert({ children, ...props }: BadgeProps) {
  return (
    <Badge
      bg={useColorModeValue('red.200', 'darkred')}
      color={useColorModeValue('darkred', 'red.200')}
      borderColor={useColorModeValue('darkred', undefined)}
      borderWidth={useColorModeValue(1, 0)}
      {...props}
    >
      <UiError /> {children}
    </Badge>
  );
}

export function InfoAlert({ children, ...props }: BadgeProps) {
  return (
    <Badge
      bg={useColorModeValue('gray.50', 'gray.800')}
      color={useColorModeValue('gray.800', 'gray.50')}
      borderColor={useColorModeValue('gray.800', undefined)}
      borderWidth={useColorModeValue(1, 0)}
      {...props}
    >
      <UiInfo /> {children}
    </Badge>
  );
}

export function WarningAlert({ children, ...props }: BadgeProps) {
  return (
    <Badge
      bg={useColorModeValue('orange.50', 'orange.800')}
      color={useColorModeValue('orange.800', 'orange.50')}
      borderColor={useColorModeValue('orange.800', undefined)}
      borderWidth={useColorModeValue(1, 0)}
      {...props}
    >
      <UiWarning /> {children}
    </Badge>
  );
}

export function GoodAlert({ children, ...props }: BadgeProps) {
  return (
    <Badge
      bg={useColorModeValue('green.50', 'green.800')}
      color={useColorModeValue('green.800', 'green.50')}
      borderColor={useColorModeValue('green.800', undefined)}
      borderWidth={useColorModeValue(1, 0)}
      {...props}
    >
      <UiOk /> {children}
    </Badge>
  );
}
