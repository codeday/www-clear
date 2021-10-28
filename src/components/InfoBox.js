import React from 'react';
import Box from '@codeday/topo/Atom/Box';

export default function InfoBox({children, heading, headingSize, ...props}) {
    return (
        <Box
            d="block"
            bg="gray.100"
            rounded={5}
            p={1}
            m={1}
            {...props}
        >
            <Box ml={1} fontSize={headingSize}>
                <b>{heading}</b>
            </Box>
            <Box
                bg="gray.50"
                mt={1}
                rounded={5}
                p={1}
            >
                {children}
            </Box>
        </Box>
    );
}
