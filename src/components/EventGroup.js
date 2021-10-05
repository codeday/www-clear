import React from 'react';
import Box from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import moment from 'moment';

export default function EventGroup({group, ...props}) {
    const startDate = moment(group.startDate).utc();
    const endDate = moment(group.endDate).utc();
    return (
        <Box id={group.id}
             bg="gray.50"
             p={4}
             rounded={10}
             width="fit-content" {...props}
             as="a"
             href={`groups/${group.id}`}>
            <b>{group.name}</b>
            <Text>{group.displayDate}</Text>
            <Text>{group.events.length} Events</Text>
        </Box>
    );
}
