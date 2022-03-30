import React, { useState } from 'react';
import {print} from 'graphql';
import { useSession } from 'next-auth/react';
import Text from "@codeday/topo/Atom/Text";
import Box from "@codeday/topo/Atom/Box";
import Button from '@codeday/topo/Atom/Button';
import {useToasts} from '@codeday/topo/utils';
import {checkin, checkout} from './Ticket.gql';
import Badge from "./Badge";
import Alert from "./Alert";
import {useFetcher} from '../fetch';

export default function Ticket({ticket, ...props}) {
    const { data: session } = useSession();

    const [loading, setLoading] = useState(false);
    const [checkedIn, setCheckedIn] = useState(ticket.checkedIn);
    const [checkedOut, setCheckedOut] = useState(ticket.checkedOut);
    const {success, error} = useToasts();
    const fetch = useFetcher(session);
    const checkAction = checkedIn && !checkedOut ? 'out' : 'in';

    return (
        <Box id={ticket.id}
             bg={"gray.50"}
             m={2}
             p={4}
             rounded={10}
             width="fit-content"
             {...props}
           >
            <a href={`tickets/${ticket.id}`}>
              <Text fontSize="lg" bold d="inline">{ticket.lastName}, {ticket.firstName}</Text>
              <TicketTypeBadge ticket={ticket}/>
            </a>
            <Text mb={0}><Text as="span" bold>Age:</Text> {ticket.age}</Text>
            {ticket.email && <Text mb={0}><Text as="span" bold>Email:</Text> {ticket.email}</Text>}
            {ticket.phone && <Text mb={0}><Text as="span" bold>Phone:</Text> {ticket.phone}</Text>}
            {session && (
              <Button
                  isLoading={loading}
                  disabled={loading}
                  size="sm"
                  onClick={async () => {
                      setLoading(true);
                      try {
                          const res = await fetch(print(checkAction === 'out' ? checkout : checkin), {
                            where: { id: ticket.id },
                          });
                          success(`Checked ${ticket.firstName} ${ticket.lastName} ${checkAction}.`);
                          setCheckedIn(res.clear.checkinout.checkedIn);
                          setCheckedOut(res.clear.checkinout.checkedOut);
                      } catch (ex) {
                          error(ex.toString());
                      }
                      setLoading(false);
                  }}
              >
                Check {checkAction}
              </Button>
            )}
            {!ticket.waiverSigned && <Alert>No waiver</Alert>}
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
            textTransform="lowercase"
            fontSize="xs"
            {...props}
        >
            {ticket.type}
        </Badge>
    )
}
