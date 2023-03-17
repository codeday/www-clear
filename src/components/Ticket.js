import React, { useState } from 'react';
import { print } from 'graphql';
import { useSession } from 'next-auth/react';
import { Box, Button, Text } from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { Eye } from '@codeday/topocons';
import { useColorModeValue } from '@codeday/topo/Theme';
import Link from 'next/link';
import { checkin, checkout, sendWaiverReminder } from './Ticket.gql';
import Badge from './Badge';
import Alert, { GoodAlert } from './Alert';
import { useFetcher } from '../fetch';
import InfoBox from './InfoBox';

export default function Ticket({ ticket, eventId, ...props }) {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(ticket.checkedIn);
  const [checkedOut, setCheckedOut] = useState(ticket.checkedOut);
  const { success, error } = useToasts();
  const fetch = useFetcher(session);
  const checkAction = checkedIn && !checkedOut ? 'out' : 'in';

  return (
    <InfoBox
      id={ticket.id}
      buttons={(
        // button is just here to look nice lol
        <Button h={6}>
          <Eye />
        </Button>
        )}
      heading={(
        <>
          {ticket.lastName}, {ticket.firstName}
          {ticket.age && ` (${ticket.age})`}
          <TicketTypeBadge ticket={ticket} />
        </>
        )}
      {...props}
      href={
          eventId || ticket.event?.id
            ? `/events/${eventId || ticket.event.id}/tickets/${ticket.id}`
            : `tickets/${ticket.id}`
        }
    >
      <Text mb={0}>
        <Text as="span" bold>
          Id:
        </Text>{' '}
        {ticket.id}
      </Text>
      {ticket.email && (
      <Text mb={0}>
        <Text as="span" bold>
          Email:
        </Text>{' '}
        {ticket.email}
      </Text>
      )}
      {ticket.phone && (
      <Text mb={0}>
        <Text as="span" bold>
          Phone:
        </Text>{' '}
        {ticket.phone}
      </Text>
      )}
      {ticket.whatsApp && (
      <Text mb={0}>
        <Text as="span" bold>
          WhatsApp:
        </Text>{' '}
        {ticket.whatsApp}
      </Text>
      )}
      {ticket.promoCode && (
      <Text mb={0}>
        <Text as="span" bold>
          Promo:
        </Text>{' '}
        {ticket.promoCode.code}
      </Text>
      )}
      {!ticket.waiverSigned && (
      <Box>
        <Text as="span" bold>
          Waiver:
        </Text>{' '}
        <Button
          size="xs"
          mr={2}
          isLoading={loading}
          onClick={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const res = await fetch(print(sendWaiverReminder), {
                where: { id: ticket.id },
              });
              success(
                `Sent waiver reminder to ${ticket.firstName} ${ticket.lastName} (or parent).`,
              );
            } catch (ex) {
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
            e.preventDefault();
            setLoading(true);
            try {
              const res = await fetch(print(sendWaiverReminder), {
                where: { id: ticket.id },
                regenerate: true,
              });
              success(
                `Sent waiver reminder to ${ticket.firstName} ${ticket.lastName} (or parent).`,
              );
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
        >
          Fix Link
        </Button>
        {ticket.waiverUrl && (
          <Link href={ticket.waiverUrl} passHref>
            <Button target="_blank" size="xs" as="a" onClick={(e) => e.stopPropagation()}>Sign Here</Button>
          </Link>
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
          e.preventDefault();
          setLoading(true);
          try {
            const res = await fetch(
              print(checkAction === 'out' ? checkout : checkin),
              {
                where: { id: ticket.id },
              },
            );
            success(
              `Checked ${ticket.firstName} ${ticket.lastName} ${checkAction}.`,
            );
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
      {ticket.waiverSigned ? (
        <GoodAlert>Waiver</GoodAlert>
      ) : (
        <Alert>Waiver</Alert>
      )}
      {ticket.vaccineVerified ? (
        <GoodAlert>Vaccine</GoodAlert>
      ) : (
        <Alert>Vaccine</Alert>
      )}
    </InfoBox>
  );
}

export function TicketTypeBadge({ ticket, ...props }) {
  const ticketTypeStyles = {
    STAFF: {
      bg: 'pink.200',
      color: 'pink.800',
    },
    JUDGE: {
      bg: 'orange.200',
      color: 'orange.800',
    },
    MENTOR: {
      bg: 'green.200',
      color: 'green.800',
    },
    VIP: {
      bg: 'purple.200',
      color: 'purple.800',
    },
  };
  return (
    <Badge
      bg={useColorModeValue(
        ticketTypeStyles[ticket.type]?.bg || 'gray.200',
        ticketTypeStyles[ticket.type]?.color || 'gray.800',
      )}
      color={useColorModeValue(
        ticketTypeStyles[ticket.type]?.color || 'gray.800',
        ticketTypeStyles[ticket.type]?.bg || 'gray.200',
      )}
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
  );
}
