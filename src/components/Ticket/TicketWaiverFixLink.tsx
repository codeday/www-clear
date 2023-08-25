import { ButtonProps } from '@chakra-ui/react';
import { Spinner, Button, Tooltip } from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { graphql } from 'generated/gql';
import { ClearTicket } from 'generated/gql/graphql';
import { useState } from 'react';
import { useMutation, useQuery } from 'urql';

// TODO: refactor clear-gql `sendWaiverReminder` to return a `Ticket`, so we don't need this query
const query = graphql(`
  query TicketWaiverFixLink($where: ClearTicketWhereUniqueInput!) {
    clear {
      ticket(where: $where) {
        id
        firstName
        lastName
      }
    }
  }
`);

const fixWaiverLink = graphql(`
  mutation FixWaiverLink($where: ClearTicketWhereUniqueInput!) {
    clear {
      sendWaiverReminder(where: $where, regenerate: true)
    }
  }
`);

export type TicketWaiverFixLinkProps = {
  ticket: PropFor<ClearTicket>;
} & ButtonProps;

export function TicketWaiverFixLink({ ticket: ticketData, ...props }: TicketWaiverFixLinkProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: ticketData.id } } });
  const [result, doFixWaiverLink] = useMutation(fixWaiverLink);
  const [loading, setLoading] = useState(false);
  const { error, success } = useToasts();
  const ticket = data?.clear?.ticket;
  if (!ticket) return <Spinner />;
  return (
    <Tooltip label="This fixes a rare bug that requires the waiver link to be re-generated.">
      <Button
        size="xs"
        mr={2}
        isLoading={loading}
        isDisabled={loading}
        onClick={async (e) => {
          e.preventDefault();
          setLoading(true);
          // TODO: invalidate cache
          await doFixWaiverLink({ where: { id: ticket.id } });
          if (result.error) {
            error(result.error.name, result.error.message);
          } else {
            success(`Sent fixed waiver link to ${ticket.firstName} ${ticket.lastName} (or parent).`);
          }
          setLoading(false);
        }}
        {...props}
      >
        Fix Link
      </Button>
    </Tooltip>
  );
}
