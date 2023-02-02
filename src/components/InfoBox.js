import React from 'react';
import {Box, Flex, Text} from '@codeday/topo/Atom';
import {useColorModeValue} from "@codeday/topo/Theme";

export default function InfoBox({children, heading, subHeading, headingSize, buttons, nested, ...props}) {
    return (
      <Box
        d="block"
        borderWidth={0}
        rounded={nested ? 1 : 3}
        boxShadow="base"
        m={nested ? 0 : 2}
        {...props}
      >
          {heading && (
            <Box
              backgroundColor={useColorModeValue(nested ? 'gray.100' : 'gray.200', nested ? 'gray.1000' : 'gray.1200')}
              fontSize={headingSize}
              p={2}
            >
                <Flex fontWeight="bold" justifyContent="space-between">
                    <Box>{heading}</Box>
                    <Box>{buttons}</Box>
                </Flex>
                {subHeading && <Text color="current.textLight" fontSize="sm">{subHeading}</Text>}
            </Box>
          )}
          <Box
            mt={1}
            rounded={5}
            p={1}
          >
              {children}
          </Box>
      </Box>
    );
}
