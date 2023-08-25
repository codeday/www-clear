import React from 'react';
import { Box, Button, Text, Spinner } from '@codeday/topo/Atom';
import { Eye } from '@codeday/topocons';
import { graphql } from 'generated/gql';
import { ClearTicket } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import { Alert, GoodAlert } from '../Alert';
import { InfoBox, InfoBoxProps } from '../InfoBox';
import { TicketCheckInOut } from './TicketCheckInOut';
import { TicketWaiverReminder } from './TicketWaiverReminder';
import { TicketWaiverFixLink } from './TicketWaiverFixLink';
import { TicketWaiverSignHere } from './TicketWaiverSignHere';
import { TicketTypeBadge } from './TicketTypeBadge';

const query = graphql(`
  query TicketBox($where: ClearTicketWhereUniqueInput!) {
    clear {
      ticket(where: $where) {
        id
        firstName
        lastName
        age
        email
        phone
        whatsApp
        type
        needsGuardian
        waiverSigned
        waiverUrl
        checkedIn
        checkedOut
        vaccineVerified: getMetadata(key: "vaccineVerified")
        promoCode {
          id
          code
        }
        event {
          id
        }
      }
    }
  }
`);

export type TicketBoxProps = {
  ticket: PropFor<ClearTicket>;
} & InfoBoxProps;

export function TicketBox({ ticket: ticketData, ...props }: TicketBoxProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: ticketData.id } } });
  const ticket = data?.clear?.ticket;

  if (!ticket) return <Spinner />;
  const viewLink = `/events/${ticket.event.id}/tickets/${ticket.id}`;

  return (
    <InfoBox
      as="a"
      href={viewLink}
      id={ticket.id}
      buttons={
        <Button h={6} as="a" href={viewLink}>
          <Eye />
        </Button>
      }
      heading={
        <>
          {ticket.lastName}, {ticket.firstName}
          {ticket.age && ` (${ticket.age})`}
          <TicketTypeBadge ticket={ticket} />
        </>
      }
      {...props}
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
          </Text>
          <TicketWaiverReminder ticket={ticket} />
          <TicketWaiverFixLink ticket={ticket} />
          <TicketWaiverSignHere ticket={ticket} />
          <br />
        </Box>
      )}
      <TicketCheckInOut ticket={ticket} />
      {ticket.waiverSigned ? <GoodAlert>Waiver</GoodAlert> : <Alert>Waiver</Alert>}
      {ticket.vaccineVerified ? <GoodAlert>Vaccine</GoodAlert> : <Alert>Vaccine</Alert>}
    </InfoBox>
  );
}
