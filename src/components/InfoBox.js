import React from 'react';
import Box, { Flex } from '@codeday/topo/Atom/Box';

export default function InfoBox({children, heading, headingSize, buttons, nested, ...props}) {
    return (
        <Box
            d="block"
            borderWidth={3}
            rounded={nested ? 1 : 3}
            borderColor={nested ? 'gray.100' : undefined}
            m={nested ? 0 : 1}
            {...props}
        >
            {heading && (

                <Flex
                    backgroundColor={nested ? 'gray.100' : 'gray.200'}
                    fontSize={headingSize}
                    justifyContent="space-between"
                    fontWeight="bold"
                    pl={1}
                    pr={1}
                    pb={buttons ? 1 : 0}
                >
                    <Box>{heading}</Box>
                    <Box>{buttons}</Box>
                </Flex>
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
