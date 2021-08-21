import React from 'react'
import Box from '@codeday/topo/Atom/Box'
import Text from '@codeday/topo/Atom/Text'
export default function Event({event, ...props}){
    return (
        <Box id={event.id} bg={"gray.50"} p={4} rounded={10} width="fit-content" {...props} as="a" href={`/events/${event.id}`} >
            <b>{event.name}</b>
            <Text>{event.eventGroup?.name || null}</Text>
            <Text>{event.displayDate}</Text>
        </Box>
    )
}
