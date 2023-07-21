import React from 'react';
import { Box, HStack } from '@codeday/topo/Atom';
import {useColorModeValue} from "@codeday/topo/Theme";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import { FileDoc } from '@codeday/topocons/Icon'

export default function DocsCallout({
  children,
  ...props
}: any) {
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      p={1}
      px={2}
      m={1}
      borderWidth={2}
      borderColor={useColorModeValue("red.200", "red.800")}
      borderStyle="dashed"
      rounded={10}
      {...props}
    >
      <HStack>
        <Box display="inline-block">
          <FileDoc />
        </Box>
        <Box>
          {children}

        </Box>
      </HStack>
    </Box>
  );
}
