import React from 'react';
import { Button, Heading, Text, Link, Grid, Spinner } from '@codeday/topo/Atom';
import { Eye, UiAdd } from '@codeday/topocons';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { Page } from 'src/components/Page';

import { graphql } from 'generated/gql';
import { useRouter } from 'next/router';
import { useQuery } from 'urql';
import { EditMetadata } from 'src/components/forms/EditMetadata';
import NotFound from 'src/pages/404';
import { VenueBox } from '../../../components/Venue/VenueBox';
import { CreateVenue } from '../../../components/forms/Venue';
import { EventRegistrationsToggle } from '../../../components/Event/EventRegistrationsToggle';
import { EventSponsorSummary } from '../../../components/Event/EventSponsorSummary';
import { DeleteEvent, UpdateEvent } from '../../../components/forms/Event';

import {
  EventDaysUntil,
  EventRegistrationGraph,
  EventRestrictionSummary,
  EventScheduleSummary,
  EventTicketDetails,
} from '../../../components/Event';
import { ScheduleItem } from '../../../components/forms/ScheduleItem';
import { InfoBox } from '../../../components/InfoBox';
import { MetadataBox } from '../../../components/MetadataBox';

const query = graphql(`
  query EventIndex($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        __typename
        id
        name
        displayDate
        metadata
        eventGroup {
          id
          name
        }
        venue {
          id
        }
      }
    }
  }
`);

export default function Event() {
  const router = useRouter();
  const { event: eventId } = router.query;
  const [{ data }] = useQuery({ query, variables: { where: { id: eventId?.toString() } } });
  const event = data?.clear?.event;
  
  if (!event) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page title={event.name}>
      <Breadcrumbs event={event} />
      <Heading>
        {event.name} ({event.displayDate})
        <UpdateEvent compact event={event} />
        <DeleteEvent compact event={event} />
      </Heading>
      <Text>{event.eventGroup.name}</Text>
      <EventDaysUntil event={event} />
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}>
        <VenueBox
          venue={event.venue}
          buttons={
            !event.venue && (
              <CreateVenue>
                <UiAdd />
              </CreateVenue>
            )
          }
        />
        <EventRegistrationsToggle event={event} />
        <EventSponsorSummary event={event} />
        <EventRegistrationGraph
          event={event}
          buttons={
            <Button h={6} as="a" href={`${event.id}/tickets`}>
              <Eye />
            </Button>
          }
        />
        <EventScheduleSummary
          event={event}
          buttons={
            <>
              <Button h={6} as="a" href={`${event.id}/schedule`}>
                <Eye />
              </Button>
              &nbsp;
              {/* <CreateScheduleItem /> */}
            </>
          }
        />
        <EditMetadata of={event} mKey="notes" />
        <EventTicketDetails
          event={event}
          buttons={
            <Button h={6} as="a" href={`${event.id}/promoCodes`}>
              PROMOS
            </Button>
          }
        />
        <EventRestrictionSummary event={event} />
        <InfoBox heading="Actions">
          <Button w="100%" mb={2} as="a" href={`${event.id}/tickets/scan`}>
            Check-In/Out
          </Button>
          <Button w="100%" mb={2} as="a" href={`${event.id}/notification`}>
            Send Notification
          </Button>
          <Button w="100%" mb={2} as="a" href={`${event.id}/advancedConfig`}>
            Edit Advanced Config
          </Button>
          <Button
            w="100%"
            mb={2}
            as="a"
            target="_blank"
            href={`https://showcase.codeday.org/projects/all/event=${event.id}`}
          >
            View Projects
          </Button>
          <Button w="100%" mb={2} as="a" target="_blank" href="https://showcase.codeday.org/upload-photos">
            Upload Photos
          </Button>
        </InfoBox>
        <MetadataBox metadata={event.metadata} />
      </Grid>
    </Page>
  );
}
