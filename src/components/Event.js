import React from 'react'
import Text from '@codeday/topo/Atom/Text'
import InfoBox from "./InfoBox";

export default function Event({event, ...props}) {
    return (
        <InfoBox heading={event.name} id={event.id} as="a" href={`/events/${event.id}`} {...props}>
            <Text mb={0}>{event.eventGroup?.name || null}</Text>
            <Text mb={0}>{event.displayDate}</Text>
            <Text mb={0}>{event.soldTickets} students</Text>
        </InfoBox>
    )
}
