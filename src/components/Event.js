import React from 'react'
import Box from '@codeday/topo/Atom/Box'
import Text from '@codeday/topo/Atom/Text'
import moment from 'moment';
export default function Event({event, ...props}){
    const startDate = moment(event.startDate)
    const endDate = moment(event.endDate)
    return (
        <Box id={event.id} bg={"gray.50"} p={4} rounded={10} width="fit-content" {...props} as="a" href={`/events/${event.id}`} >
            <b>{event.name}</b>
            <Text>{event.eventGroup?.name || null}</Text>
                { (event.startDate && event.endDate)?
                startDate.month() === endDate.month()?
                    <Text>{startDate.format('MMM Do')}-{endDate.format('Do YYYY')}</Text> :
                    <Text>{startDate.format('MMM Do')}-{endDate.format('MMM Do YYYY')}</Text>: <></>
            }
        </Box>
    )
}
