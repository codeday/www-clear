import React from 'react';
import { Button, Heading, Text, Grid, Badge, Spinner, Flex } from '@codeday/topo/Atom';
import { DevicePhone, Email, IdCard, Ticket, UiAdd } from '@codeday/topocons';
import { useRouter } from 'next/router';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import NotFound from 'src/pages/404';
import { EditMetadata } from 'src/components/forms';
import { CreateGuardian, DeleteGuardian, UpdateGuardian } from 'src/components/forms/Guardian';
import { Page } from '../../../../../components/Page';

import { TicketTypeBadge } from '../../../../../components/Ticket';
import { Breadcrumbs } from '../../../../../components/Breadcrumbs';
import { Alert } from '../../../../../components/Alert';
import { DeleteTicket, UpdateTicket } from '../../../../../components/forms/Ticket';

import { InfoBox } from '../../../../../components/InfoBox';

import { MetadataBox } from '../../../../../components/MetadataBox';

const query = graphql(`
  query TicketPage($where: ClearTicketWhereUniqueInput!) {
    clear {
      ticket(where: $where) {
        id
        __typename
        email
        metadata
        surveyResponses
        createdAt
        waiverPdfUrl
        firstName
        lastName
        phone
        age
        whatsApp
        payment {
          id
          stripePaymentIntentId
        }
        event {
          id
          name
          displayDate
          majorityAge
        }
        promoCode {
          id
          code
        }
        guardian {
          id
          firstName
          lastName
          email
          phone
          whatsApp
          username
        }
      }
    }
  }
`);

export default function TicketPage() {
  const router = useRouter();
  const [{ data, fetching, stale }] = useQuery({ query, variables: { where: { id: router.query.ticket as string } } });
  const ticket = data?.clear?.ticket;

  if (ticket === null && !fetching && !stale) {
    return <NotFound />;
  }
  if (!ticket) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page>
      <Breadcrumbs event={ticket.event} ticket={ticket} />
      <Badge>CONFIDENTIAL</Badge>
      <br />
      <Heading display="inline">
        <Ticket />
        {ticket.firstName} {ticket.lastName}
        <TicketTypeBadge m={1} ticket={ticket} />
        <UpdateTicket compact ticket={ticket} />
        <DeleteTicket compact ticket={ticket} onSubmit={() => router.push(`/events/${ticket.event.id}/tickets`)} />
      </Heading>
      <Flex flexWrap="wrap">
        <InfoBox heading="Attendee details">
          {ticket.email && (
            <>
              <Email /> Email: {ticket.email} <br />
            </>
          )}
          {ticket.phone && (
            <>
              <DevicePhone /> Phone: {ticket.phone} <br />
            </>
          )}
          {ticket.whatsApp && (
            <>
              <DevicePhone /> WhatsApp: {ticket.whatsApp} <br />
            </>
          )}
          <IdCard /> {ticket.age} years old
          {ticket.waiverPdfUrl && (
            <>
              <br />
              <Button as="a" target="_blank" href={ticket.waiverPdfUrl}>
                Waiver
              </Button>
            </>
          )}
        </InfoBox>
        {ticket.age && ticket.age < ticket.event.majorityAge ? (
          <InfoBox
            heading={
              <>
                <Text display="inline">Guardian details</Text>
                {ticket.guardian ? (
                  <>
                    <UpdateGuardian compact guardian={ticket.guardian} />
                    <DeleteGuardian compact guardian={ticket.guardian} />
                  </>
                ) : (
                  <CreateGuardian compact ticket={ticket} />
                )}
              </>
            }
          >
            {ticket.guardian ? (
              <>
                <IdCard />
                &nbsp;
                {ticket.guardian.firstName} {ticket.guardian.lastName} <br />
                {ticket.guardian.email && (
                  <>
                    <Email />
                    &nbsp; Email: {ticket.guardian.email} <br />
                  </>
                )}
                {ticket.guardian.phone && (
                  <>
                    <DevicePhone />&nbsp;
                    Phone: {ticket.guardian.phone} <br />
                  </>
                )}
                {ticket.guardian.whatsApp && (
                  <>
                    <DevicePhone />&nbsp;
                    WhatsApp: {ticket.guardian.whatsApp} <br />
                  </>
                )}
              </>
            ) : (
              <Alert>No Guardian Info</Alert>
            )}
          </InfoBox>
        ) : null}
        <InfoBox heading="Payment Details">
          Registered on: {ticket.createdAt.toLocaleString()} <br />
          Promo Code used: {ticket.promoCode?.code || 'N/A'} <br />
          Payment intent ID: {ticket.payment?.stripePaymentIntentId || 'N/A'}
        </InfoBox>
        <MetadataBox
          heading="Survey Responses"
          hideChangeNote
          metadata={Object.fromEntries(
            Object.entries(ticket.surveyResponses || {}).filter(([k, v]) => !k.startsWith('study.')),
          )}
        />
        <MetadataBox metadata={ticket.metadata} />
        <EditMetadata of={ticket} mKey="notes" />
      </Flex>
    </Page>
  );
}
