import { BadgeProps } from '@chakra-ui/react';
import { Spinner, Badge } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearTicket } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import { useColorModeValue } from '@codeday/topo/Theme';

const ticketTypeStyles = {
  STUDENT: {
    bg: 'gray.200',
    color: 'gray.800',
  },
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
  TEACHER: {
    bg: 'teal.200',
    color: 'teal.800',
  },
};

const query = graphql(`
  query TicketTypeBadge($where: ClearTicketWhereUniqueInput!) {
    clear {
      ticket(where: $where) {
        id
        type
      }
    }
  }
`);

export type TicketTypeBadgeProps = {
  ticket: PropFor<ClearTicket>;
} & BadgeProps;

export function TicketTypeBadge({ ticket: ticketData, ...props }: TicketTypeBadgeProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: ticketData.id } } });
  const ticket = data?.clear?.ticket;
  const isLightMode = useColorModeValue(true, false);
  if (!ticket) return <Spinner />;

  return (
    <Badge
      bg={isLightMode ? ticketTypeStyles[ticket.type].bg : ticketTypeStyles[ticket.type].color}
      color={isLightMode ? ticketTypeStyles[ticket.type].color : ticketTypeStyles[ticket.type].bg}
      // textTransform="lowercase"
      fontSize="xs"
      // p={1}
      // position="relative"
      // top="-0.2em"
      // ml={2}
      {...props}
    >
      {ticket.type}
    </Badge>
  );
}
