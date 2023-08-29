import React from 'react';
import { Calendar, PaymentCash, PaymentDiscount } from '@codeday/topocons';
import { Text } from '@codeday/topo/Atom';
import { useQuery } from 'urql';
import { graphql } from 'generated/gql';
import { ClearEvent } from 'generated/gql/graphql';
import { Spinner } from '@chakra-ui/react';
import { Alert, GoodAlert } from '../Alert';
import { InfoBox, InfoBoxProps } from '../InfoBox';

const query = graphql(`
  query EventTicketDetails($data: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $data) {
        id
        ticketPrice
        registrationCutoff
        earlyBirdCutoff
        earlyBirdPrice
        canEarlyBirdRegister
        canRegister
        registrationsOpen
        region {
          currencySymbol
        }
      }
    }
  }
`);

export type EventTicketDetailsProps = {
  event: PropFor<ClearEvent>;
} & InfoBoxProps;

export function EventTicketDetails({ event: eventData, children, ...props }: EventTicketDetailsProps) {
  const [{ data }] = useQuery({ query, variables: { data: { id: eventData.id } } });
  const event = data?.clear?.event;
  if (!event) return <Spinner />;
  return (
    <InfoBox headingSize="xl" heading="Pricing" {...props}>
      <Text mb={0}>
        <PaymentDiscount />
        Early Bird Ticket Price: {event.region?.currencySymbol}
        {event.earlyBirdPrice}
      </Text>
      <Text mb={0}>
        <Calendar />
        Early Bird Deadline: {event.earlyBirdCutoff.toLocaleString()}
      </Text>
      {event.registrationsOpen ? (
        event.canEarlyBirdRegister ? (
          <GoodAlert>Early Bird Active</GoodAlert>
        ) : (
          <Alert>Early Bird Inactive</Alert>
        )
      ) : null}
      <Text mb={0} mt={2}>
        <PaymentCash />
        Regular Ticket Price: {event.region?.currencySymbol}
        {event.ticketPrice}
      </Text>
      <Text mb={0}>
        <Calendar />
        Registration Deadline: {event.registrationCutoff.toLocaleString()}
      </Text>
      {event.registrationsOpen ? (
        event.canRegister ? (
          <GoodAlert>Registrations Active</GoodAlert>
        ) : (
          <Alert>Registrations Inactive</Alert>
        )
      ) : null}
      {children}
    </InfoBox>
  );
}
