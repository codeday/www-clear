import React from 'react';
import Text from "@codeday/topo/Atom/Text";
import Box from "@codeday/topo/Atom/Box";
import Alert from "./Alert";
import Badge from "./Badge";

export default function Ticket({ticket, ...props}) {
    console.log(ticket)
    return (
        <Box id={ticket.id}
             bg={"gray.50"}
             m={2}
             p={4}
             rounded={10}
             width="fit-content" {...props}
             as="a"
             display="block"
             href={`tickets/${ticket.id}`}>
            <TicketTypeBadge ticket={ticket}/>
            <b>{ticket.firstName} {ticket.lastName}</b>{ticket.age ? '-' : null} {ticket.age}
            {ticket.needsGuardian ? <><br/><Alert>Needs Guardian</Alert></> : null}
            {ticket.email ? <Text>{ticket.email}</Text> : null}
        </Box>)
}

export function TicketTypeBadge({ticket, ...props}) {
    const ticketTypeStyles = {
        STAFF: {
            bg: "pink.200",
            color: "pink.800"
        },
        JUDGE: {
            bg: "orange.200",
            color: "orange.800"
        },
        MENTOR: {
            bg: "green.200",
            color: "green.800"
        },
        VIP: {
            bg: "purple.200",
            color: "purple.800"
        },
    }
    return (
        <Badge
            bg={ticketTypeStyles[ticket.type]?.bg || "gray.200"}
            color={ticketTypeStyles[ticket.type]?.color || "gray.800"}
            {...props}
        >
            {ticket.type}
        </Badge>
    )
}
