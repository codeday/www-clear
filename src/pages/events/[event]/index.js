import React from 'react';
import {
  Button, Heading, Text, Link,
} from '@codeday/topo/Atom';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Eye, UiAdd } from '@codeday/topocons';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import { getEventQuery } from './index.gql';
import { getFetcher } from '../../../fetch';
import Breadcrumbs from '../../../components/Breadcrumbs';
import VenueInfo from '../../../components/VenueInfo';
import { CreateVenueModal } from '../../../components/forms/Venue';
import Alert from '../../../components/Alert';
import Notes from '../../../components/forms/Notes';
import RegistrationsToggleWithChecklist from '../../../components/RegistrationsToggleWithChecklist';
import SponsorOverview from '../../../components/SponsorOverview';
import RegistrationGraph from '../../../components/RegistrationGraph';
import { DeleteEventModal, UpdateEventModal } from '../../../components/forms/Event';
import { SetEventNotesMutation } from '../../../components/forms/Notes.gql';
import DaysUntilEvent from '../../../components/DaysUntilEvent';
import { CreateSponsorModal } from '../../../components/forms/Sponsor';
import { CreateScheduleItemModal } from '../../../components/forms/ScheduleItem';
import ScheduleBox from '../../../components/ScheduleBox';
import TicketBox from '../../../components/TicketBox';
import EventRestrictionBox from '../../../components/EventRestrictionBox';
import InfoBox from '../../../components/InfoBox';
import MetadataBox from '../../../components/MetadataBox';

export default function Event({ event }) {
  if (!event) return <></>;
  return (
    <>
      <Breadcrumbs event={event} />
      <Heading>
        {event.name} ({event.displayDate})
        <UpdateEventModal event={event} />
        <DeleteEventModal event={event} />
      </Heading>
      <Text>{event.eventGroup.name}</Text>
      <DaysUntilEvent event={event} />
      <ResponsiveMasonry>
        <Masonry>
          <VenueInfo
            venue={event.venue}
            buttons={!event.venue && <CreateVenueModal event={event}><UiAdd /></CreateVenueModal>}
          />
          <RegistrationsToggleWithChecklist event={event} />
          <SponsorOverview
            sponsors={event.sponsors}
            heading="Sponsors"
            currencySymbol={event.region?.currencySymbol}
            buttons={(
              <>
                <Button h={6} as="a" href={`${event.id}/sponsors`}><Eye /></Button>
                            &nbsp;
                <CreateSponsorModal event={event}><UiAdd /></CreateSponsorModal>
              </>
                        )}
          />
          <RegistrationGraph
            event={event}
            buttons={
              <Button h={6} as="a" href={`${event.id}/tickets`}><Eye /></Button>
                        }
          />
          <ScheduleBox
            schedule={event.schedule}
            buttons={(
              <>
                <Button h={6} as="a" href={`${event.id}/schedule`}><Eye /></Button>
                                &nbsp;
                <CreateScheduleItemModal event={event}><UiAdd /></CreateScheduleItemModal>
              </>
                          )}
          />
          <Notes
            notes={event.notes}
            updateId={event.id}
            headingSize="xl"
            updateMutation={SetEventNotesMutation}
          />
          <TicketBox
            event={event}
            buttons={
              <Button h={6} as="a" href={`${event.id}/promoCodes`}>PROMOS</Button>
                      }
          />
          <EventRestrictionBox
            restrictions={[
              ...(event?.region?.localizationConfig?.requiredEventRestrictions?.items || []),
              ...event.cmsEventRestrictions,
            ]}
            buttons={(
              <Button h={6} as="a" href={`${event.id}/eventRestrictions`}>
                <Eye />
              </Button>
                          )}
          />
          <InfoBox heading="Actions">
            <Button w="100%" mb={2} as="a" href={`${event.id}/tickets/scan`}>Check-In/Out</Button>
            <Button w="100%" mb={2} as="a" href={`${event.id}/notification`}>Send Notification</Button>
            <Button w="100%" mb={2} as="a" href={`${event.id}/advancedConfig`}>Edit Advanced Config</Button>
            <Button w="100%" mb={2} as="a" target="_blank" href={`https://showcase.codeday.org/projects/all/event=${event.id}`}>View Projects</Button>
            <Button w="100%" mb={2} as="a" target="_blank" href="https://showcase.codeday.org/upload-photos">Upload Photos</Button>
          </InfoBox>
          <MetadataBox metadata={event.metadata}>
            <Link href={`${event.id}/advancedConfig`}>Set metadata (advanced)</Link>
          </MetadataBox>
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}

export async function getServerSideProps({ req, res, query: { event: eventId } }) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const eventResults = await fetch(getEventQuery, { data: { id: eventId } });
  const event = eventResults?.clear?.event;
  if (!event) {
    return {
      redirect: {
        destination: `/events`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      event,
      title: event?.name,
    },
  };
}
