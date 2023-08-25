import { ButtonProps } from '@chakra-ui/react';
import { Spinner, Button } from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { graphql } from 'generated/gql';
import { ClearTicket } from 'generated/gql/graphql';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'urql';

// TODO: refactor clear-gql `sendWaiverReminder` to return a `Ticket`, so we don't need this query
const query = graphql(`
  query TicketWaiverReminder($where: ClearTicketWhereUniqueInput!) {
    clear {
      ticket(where: $where) {
        id
        firstName
        lastName
      }
    }
  }
`);

const remindWaiver = graphql(`
  mutation RemindWaiver($where: ClearTicketWhereUniqueInput!) {
    clear {
      sendWaiverReminder(where: $where)
    }
  }
`);

export type TicketWaiverReminderProps = {
  ticket: PropFor<ClearTicket>;
} & ButtonProps;

export function TicketWaiverReminder({ ticket: ticketData, ...props }: TicketWaiverReminderProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: ticketData.id } } });
  const [result, doRemindWaiver] = useMutation(remindWaiver);
  const [loading, setLoading] = useState(false);
  const { error, success } = useToasts();
  const ticket = data?.clear?.ticket;
  if (!ticket) return <Spinner />;
  return (
    <Button
      size="xs"
      mr={2}
      isLoading={loading}
      isDisabled={loading}
      onClick={async (e) => {
        e.preventDefault();
        setLoading(true);
        await doRemindWaiver({ where: { id: ticket.id } });
        if (result.error) {
          error(result.error.name, result.error.message);
        } else {
          success(`Sent waiver reminder to ${ticket.firstName} ${ticket.lastName} (or parent).`);
        }
        setLoading(false);
      }}
      {...props}
    >
      Remind
    </Button>
  );
}
