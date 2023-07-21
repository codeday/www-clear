import React from 'react';
import {Box} from "@codeday/topo/Atom";
import {useColorModeValue} from "@codeday/topo/Theme";
import { BoxProps } from '@chakra-ui/react';

export type BadgeProps = BoxProps

// TODO: Use chakra Badge component instead, needs to be export from topo
export function Badge({
    children,
    ...props
}: BadgeProps) {
    return (
        <Box
            display="inline-flex"
            alignItems="center"
            bg={useColorModeValue("gray.200", "gray.800")}
            color={useColorModeValue("gray.800", "gray.200")}
            p={1}
            px={2}
            m={1}
            rounded={5}
            {...props}
        >
            <b>{children}</b>
        </Box>
    );
}

export function ConfidentialBadge({ ...props }: BadgeProps) {
    return (
      <Badge {...props}>CONFIDENTIAL</Badge>
    );
  }