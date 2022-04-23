import React, {useState} from 'react';
import {print} from 'graphql';
import {useSession} from 'next-auth/react';
import {Box, Button, Text} from "@codeday/topo/Atom";
import {useToasts} from '@codeday/topo/utils';
import {checkin, checkout} from './Ticket.gql';
import Badge from "./Badge";
import Alert from "./Alert";
import {useFetcher} from '../fetch';
import InfoBox from "./InfoBox";
import * as Icon from "@codeday/topocons/Icon";
import {useColorModeValue} from "@codeday/topo/Theme";

export default function Ticket({ticket, ...props}) {
    const { data: session } = useSession();

    const [loading, setLoading] = useState(false);
    const [checkedIn, setCheckedIn] = useState(ticket.checkedIn);
    const [checkedOut, setCheckedOut] = useState(ticket.checkedOut);
    const {success, error} = useToasts();
    const fetch = useFetcher(session);
    const checkAction = checkedIn && !checkedOut ? 'out' : 'in';

    return (
        <a href={`tickets/${ticket.id}`}>
        <InfoBox
            id={ticket.id}
            buttons={
                <Button h={6} as="a" href={`tickets/${ticket.id}`}>
                <Icon.Eye />
                </Button>
            }
            heading={<>
                {ticket.lastName}, {ticket.firstName}
                <TicketTypeBadge ticket={ticket}/>
                </>
                }
             {...props}
           >
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
        </InfoBox></a>)
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
            bg={useColorModeValue(ticketTypeStyles[ticket.type]?.bg || "gray.200", ticketTypeStyles[ticket.type]?.color || "gray.800")}
            color={useColorModeValue(ticketTypeStyles[ticket.type]?.color || "gray.800", ticketTypeStyles[ticket.type]?.bg || "gray.200")}
            textTransform="lowercase"
            fontSize="xs"
            {...props}
        >
            {ticket.type}
        </Badge>
    )
}
