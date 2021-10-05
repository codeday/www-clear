import React from 'react';
import Box from '@codeday/topo/Atom/Box';
import {Heading} from '@codeday/topo/Atom/Text';
import InfoBox from './InfoBox';

export default function ({schedule, children, ...props}) {
    const finalizedExternalEvents = schedule.filter((val) => val.finalized && !val.internal);
    const nonfinalizedExternalEvents = schedule.filter((val) => !val.finalized && !val.internal);
    const internalEvents = schedule.filter((val) => val.internal);
    return (
        <InfoBox heading="Schedule" {...props}>
            <Box>
                <Heading d="inline" color="green">{finalizedExternalEvents.length}</Heading> Finalized Events
            </Box>
            <Box>
                <Heading d="inline" color="orange">{nonfinalizedExternalEvents.length}</Heading> Non-Finalized Events
            </Box>
            <Box>
                <Heading d="inline" color="purple">{internalEvents.length}</Heading> Internal Events
            </Box>
            {children}
        </InfoBox>
    );
}
