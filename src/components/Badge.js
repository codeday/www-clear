import React from 'react';
import { Box } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';

export default function Badge({ children, ...props }) {
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      bg={useColorModeValue('gray.200', 'gray.800')}
      color={useColorModeValue('gray.800', 'gray.200')}
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
