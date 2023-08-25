import React from 'react';

import { UiError, UiInfo, UiOk, UiWarning } from '@codeday/topocons';
import { Badge } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';

export function Alert({ children, ...props }: any) {
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

// @ts-expect-error TS(7031) FIXME: Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
export function InfoAlert({ children, ...props }) {
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

// @ts-expect-error TS(7031) FIXME: Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
export function WarningAlert({ children, ...props }) {
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

// @ts-expect-error TS(7031) FIXME: Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
export function GoodAlert({ children, ...props }) {
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
