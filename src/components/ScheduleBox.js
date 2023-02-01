import React from 'react';
import {Box, Heading} from "@codeday/topo/Atom";
import InfoBox from './InfoBox';

export default function ({schedule, children, ...props}) {
    const finalizedExternalEvents = schedule.filter((val) => val.finalized && !val.internal);
    const nonfinalizedExternalEvents = schedule.filter((val) => !val.finalized && !val.internal);
    const internalEvents = schedule.filter((val) => val.internal);
    return (
        <InfoBox heading="Schedule" headingSize="xl" {...props}>
            <Box>
                <Heading d="inline" color="green">{finalizedExternalEvents.length}</Heading> Published Events
            </Box>
            <Box>
                <Heading d="inline" color="orange">{nonfinalizedExternalEvents.length}</Heading> Unpublished Events
            </Box>
            <Box>
                <Heading d="inline" color="purple">{internalEvents.length}</Heading> Internal Events
            </Box>
            {children}
        </InfoBox>
    );
}
