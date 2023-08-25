import React from 'react';
import { Box, BoxProps, HStack } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import { FileDoc } from '@codeday/topocons';

export default function DocsCallout({ children, ...props }: BoxProps) {
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      p={1}
      px={2}
      m={1}
      borderWidth={2}
      borderColor={useColorModeValue('red.200', 'red.800')}
      borderStyle="dashed"
      rounded={10}
      {...props}
    >
      <HStack>
        <Box display="inline-block">
          <FileDoc />
        </Box>
        <Box>{children}</Box>
      </HStack>
    </Box>
  );
}
