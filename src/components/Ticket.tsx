import React, {useState} from 'react';
import {print} from 'graphql';
import {useSession} from 'next-auth/react';
import {Box, Button, Text} from "@codeday/topo/Atom";
import {useToasts} from '@codeday/topo/utils';

// @ts-expect-error TS(2307) FIXME: Cannot find module './Ticket.gql' or its correspon... Remove this comment to see the full error message
import {checkin, checkout, sendWaiverReminder} from './Ticket.gql';
import Badge from "./Badge";
import Alert, {GoodAlert} from "./Alert";
import {useFetcher} from '../fetch';
import InfoBox from "./InfoBox";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from "@codeday/topocons/Icon";
import {useColorModeValue} from "@codeday/topo/Theme";

export default function Ticket({
    ticket,
    eventId,
    ...props
}: any) {
    const { data: session } = useSession();

    const [loading, setLoading] = useState(false);
    const [checkedIn, setCheckedIn] = useState(ticket.checkedIn);
    const [checkedOut, setCheckedOut] = useState(ticket.checkedOut);
    const {success, error} = useToasts();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const checkAction = checkedIn && !checkedOut ? 'out' : 'in';

    return (
        <a href={(eventId || ticket.event?.id) ? `/events/${eventId || ticket.event.id}/tickets/${ticket.id}` : `tickets/${ticket.id}`}>
        <InfoBox
            id={ticket.id}
            buttons={
                <Button h={6} as="a" href={eventId ? `/events/${eventId}/tickets/${ticket.id}` : `tickets/${ticket.id}`}>
                <Icon.Eye />
                </Button>
            }
            heading={<>
                {ticket.lastName}, {ticket.firstName}{ticket.age && ` (${ticket.age})`}
                <TicketTypeBadge ticket={ticket}/>
                </>
                }
             {...props}
           >
            <Text mb={0}><Text as="span" bold>Id:</Text> {ticket.id}</Text>
            {ticket.email && <Text mb={0}><Text as="span" bold>Email:</Text> {ticket.email}</Text>}
            {ticket.phone && <Text mb={0}><Text as="span" bold>Phone:</Text> {ticket.phone}</Text>}
            {ticket.whatsApp && <Text mb={0}><Text as="span" bold>WhatsApp:</Text> {ticket.whatsApp}</Text>}
            {ticket.promoCode && <Text mb={0}><Text as="span" bold>Promo:</Text> {ticket.promoCode.code}</Text>}
            {!ticket.waiverSigned && (
                <Box>
                    <Text as="span" bold>Waiver:</Text>{' '}
                    <Button
                        size="xs"
                        mr={2}
                        isLoading={loading}
                        onClick={async (e) => {
                            e.preventDefault()
                            setLoading(true);
                            try {

                                // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                const res = await fetch(print(sendWaiverReminder), {
                                  where: { id: ticket.id },
                                });
                                success(`Sent waiver reminder to ${ticket.firstName} ${ticket.lastName} (or parent).`);
                            } catch (ex) {

                                // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                                error(ex.toString());
                            }
                            setLoading(false);
                        }}
                    >
                      Remind
                    </Button>
                    <Button
                        size="xs"
                        mr={2}
                        isLoading={loading}
                        onClick={async (e) => {
                            e.preventDefault()
                            setLoading(true);
                            try {

                                // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                const res = await fetch(print(sendWaiverReminder), {
                                  where: { id: ticket.id },
                                  regenerate: true,
                                });
                                success(`Sent waiver reminder to ${ticket.firstName} ${ticket.lastName} (or parent).`);
                            } catch (ex) {

                                // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                                error(ex.toString());
                            }
                            setLoading(false);
                        }}
                    >
                      Fix Link
                    </Button>
                    {ticket.waiverUrl && (
                      <Button size="xs" as="a" href={ticket.waiverUrl} target="_blank">Sign Here</Button>
                    )}
                    <br />
                </Box>
            )}
            {session && (
              <Button
                  isLoading={loading}
                  disabled={loading}
                  size="sm"
                  onClick={async (e) => {
                      e.preventDefault()
                      setLoading(true);
                      try {

                          // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                          const res = await fetch(print(checkAction === 'out' ? checkout : checkin), {
                            where: { id: ticket.id },
                          });
                          success(`Checked ${ticket.firstName} ${ticket.lastName} ${checkAction}.`);
                          setCheckedIn(res.clear.checkinout.checkedIn);
                          setCheckedOut(res.clear.checkinout.checkedOut);
                      } catch (ex) {

                          // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                          error(ex.toString());
                      }
                      setLoading(false);
                  }}
              >
                Check {checkAction}
              </Button>
            )}
            {ticket.waiverSigned ? <GoodAlert>Waiver</GoodAlert> : <Alert>Waiver</Alert>}
	    {ticket.vaccineVerified ? <GoodAlert>Vaccine</GoodAlert> : <Alert>Vaccine</Alert>}
        </InfoBox></a>)
}


// @ts-expect-error TS(7031) FIXME: Binding element 'ticket' implicitly has an 'any' t... Remove this comment to see the full error message
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

            // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            bg={useColorModeValue(ticketTypeStyles[ticket.type]?.bg || "gray.200", ticketTypeStyles[ticket.type]?.color || "gray.800")}

            // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            color={useColorModeValue(ticketTypeStyles[ticket.type]?.color || "gray.800", ticketTypeStyles[ticket.type]?.bg || "gray.200")}
            textTransform="lowercase"
            fontSize="xs"
            p={0}
            position="relative"
            top="-0.2em"
            ml={2}
            {...props}
        >
            {ticket.type}
        </Badge>
    )
}
