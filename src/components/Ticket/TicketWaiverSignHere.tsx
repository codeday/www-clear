import { ButtonProps } from '@chakra-ui/react';
import { Spinner, Button } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearTicket } from 'generated/gql/graphql';
import React from 'react';
import { useQuery } from 'urql';
import { Alert } from '../Alert';

const query = graphql(`
  query TicketWaiverSignHere($where: ClearTicketWhereUniqueInput!) {
    clear {
      ticket(where: $where) {
        id
        waiverUrl
      }
    }
  }
`);

export type TicketWaiverSignHereProps = {
  ticket: PropFor<ClearTicket>;
} & ButtonProps;

export function TicketWaiverSignHere({ ticket: ticketData, ...props }: TicketWaiverSignHereProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: ticketData.id } } });
  const ticket = data?.clear?.ticket;
  if (!ticket) return <Spinner />;

  if (!ticket.waiverUrl) {
    return <Alert>No waiver URL</Alert>;
  }
  return (
    <Button size="xs" as="a" href={ticket.waiverUrl} target="_blank" {...props}>
      Sign Here
    </Button>
  );
}
