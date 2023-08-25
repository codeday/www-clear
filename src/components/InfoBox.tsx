import React, { ComponentType } from 'react';
import { Box, Flex, Text, BoxProps } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import { forwardRef } from '@chakra-ui/system';

type _InfoBoxProps = Partial<{
  heading: React.ReactNode;
  subHeading: string;
  headingSize: BoxProps['fontSize'];
  buttons: React.ReactNode;
  nested: Boolean;
}>;

// This needs to be exported like this to make typing function correctly with the chakra-ui `as` prop
// It still doesn't function exactly correctly but it's good enough for now
export const InfoBox = forwardRef<_InfoBoxProps, 'div'>(
  ({ children, heading, subHeading, headingSize, buttons, nested, ...props }, ref) => (
    <Box
      ref={ref}
      display="block"
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
          {subHeading && (
            <Text color="current.textLight" fontSize="sm">
              {subHeading}
            </Text>
          )}
        </Box>
      )}
      <Box mt={1} rounded={5} p={1}>
        {children}
      </Box>
    </Box>
  ),
);

export type InfoBoxProps = Parameters<typeof InfoBox>[0];
