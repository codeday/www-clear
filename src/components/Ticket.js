import React from 'react';
import Text from "@codeday/topo/Atom/Text";
import Box from "@codeday/topo/Atom/Box";

export default function Ticket({ticket, props}) {
    return (
    <Box id={ticket.id} bg={"gray.50"} m={2} p={4} rounded={10} width="fit-content" {...props} as="a" href={`tickets/${ticket.id}`} >
        <Box d="inline" bg={"gray.200"} p={1} mr={1} rounded={5} color="gray.800"><b>{ticket.type}</b></Box>
        <b>{ticket.person.firstName} {ticket.person.lastName}</b> - {ticket.person.age}
        <Text>{ticket.person.email}</Text>
    </Box>)
}
