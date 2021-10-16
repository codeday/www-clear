import React from 'react';
import Box from '@codeday/topo/Atom/Box';

export default function Badge({children, ...props}) {
    return (
        <Box
            d="inline-flex"
            alignItems="center"
            bg="gray.200"
            color="gray.800"
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
