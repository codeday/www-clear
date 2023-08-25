import { ButtonProps } from '@chakra-ui/react';
import { graphql } from 'generated/gql';
import { ClearTicket } from 'generated/gql/graphql';
import { useMutation, useQuery } from 'urql';
import { Button, Spinner } from '@codeday/topo/Atom';
import { useState } from 'react';
import { useToasts } from '@codeday/topo/utils';

const query = graphql(`
  query TicketCheckInOut($where: ClearTicketWhereUniqueInput!) {
    clear {
      ticket(where: $where) {
        id
        checkedIn
        checkedOut
        firstName
        lastName
      }
    }
  }
`);

const checkIn = graphql(`
  mutation TicketCheckIn($where: ClearTicketWhereUniqueInput!) {
    clear {
      checkin(where: $where) {
        id
        checkedIn
        checkedOut
      }
    }
  }
`);

const checkOut = graphql(`
  mutation TicketCheckOut($where: ClearTicketWhereUniqueInput!) {
    clear {
      checkout(where: $where) {
        id
        checkedIn
        checkedOut
      }
    }
  }
`);

export type TicketCheckInOutProps = {
  ticket: PropFor<ClearTicket>;
} & ButtonProps;

export function TicketCheckInOut({ ticket: ticketData, ...props }: TicketCheckInOutProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: ticketData.id } } });
  const [checkInResult, doCheckIn] = useMutation(checkIn);
  const [checkOutResult, doCheckOut] = useMutation(checkOut);
  const { success, error } = useToasts();
  const [loading, setLoading] = useState(false);
  const ticket = data?.clear?.ticket;
  if (!ticket) return <Spinner />;
  const checkAction = ticket.checkedIn && !ticket.checkedOut ? 'out' : 'in';
  return (
    <Button
      isLoading={loading}
      disabled={loading}
      size="sm"
      onClick={async (e) => {
        e.preventDefault();
        setLoading(true);
        if (checkAction === 'out') {
          await doCheckOut({ where: { id: ticketData.id } });
          if (checkOutResult.error) {
            error(checkOutResult.error.name, checkOutResult.error.message);
          } else {
            success(`Checked ${ticket.firstName} ${ticket.lastName} out.`);
          }
        } else {
          await doCheckIn({ where: { id: ticketData.id } });
          if (checkInResult.error) {
            error(checkInResult.error.name, checkInResult.error.message);
          } else {
            success(`Checked ${ticket.firstName} ${ticket.lastName} in.`);
          }
        }
        setLoading(false);
      }}
      {...props}
    >
      Check {checkAction}
    </Button>
  );
}
