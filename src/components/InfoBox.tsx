import React from 'react';
import { Box, Flex, Text, BoxProps } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import { forwardRef } from '@chakra-ui/react';

type InfoBoxProps = Partial<{
  heading: React.ReactNode;
  subHeading: string;
  headingSize: BoxProps['fontSize'];
  buttons: React.ReactNode;
  nested: Boolean;
}> &
  BoxProps;

// This needs to be exported like this to make typing function correctly with the chakra-ui `as` prop
// Other components that extend `InfoBox` also need to be exported like this for their `as` props to be properly typed
export const InfoBox = forwardRef<InfoBoxProps, 'div'>(
  ({ children, heading, subHeading, headingSize, buttons, nested, ...props }, ref) => {
    const backgroundColor = useColorModeValue(nested ? 'gray.100' : 'gray.200', nested ? 'gray.1000' : 'gray.1200');
    return (
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
          <Box backgroundColor={backgroundColor} fontSize={headingSize} p={2}>
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
    );
  },
);
