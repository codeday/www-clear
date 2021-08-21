import React from 'react'
import Box from '@codeday/topo/Atom/Box'
import Text from '@codeday/topo/Atom/Text'
import moment from 'moment';
export default function EventGroup({group, ...props}){
    const startDate = moment(group.startDate)
    const endDate = moment(group.endDate)
    return (
        <Box id={group.id} bg={"gray.50"} p={4} rounded={10} width="fit-content" {...props} as="a" href={`groups/${group.id}`} >
            <b>{group.name}</b>
            {
                startDate.month() === endDate.month()?
                    <Text>{startDate.format('MMM Do')}-{endDate.format('Do YYYY')}</Text> :
                    <Text>{startDate.format('MMM Do')}-{endDate.format('MMM Do YYYY')}</Text>
            }
            <Text>{group.events.length} Events</Text>
        </Box>
    )
}
