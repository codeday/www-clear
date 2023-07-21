import React from 'react';
import {Button, Heading, Text, Link} from "@codeday/topo/Atom";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from '@codeday/topocons/Icon';
import {getSession} from 'next-auth/react';
import Page from '../../../components/Page';

// @ts-expect-error TS(2307) FIXME: Cannot find module './index.gql' or its correspond... Remove this comment to see the full error message
import {getEventQuery} from './index.gql';
import {getFetcher} from '../../../fetch';
import Breadcrumbs from '../../../components/Breadcrumbs';
import VenueInfo from '../../../components/VenueInfo';
import {CreateVenueModal} from '../../../components/forms/Venue';
import Alert from '../../../components/Alert';
import Notes from '../../../components/forms/Notes';
import RegistrationsToggleWithChecklist from '../../../components/RegistrationsToggleWithChecklist';
import SponsorOverview from '../../../components/SponsorOverview';
import RegistrationGraph from '../../../components/RegistrationGraph';
import {DeleteEventModal, UpdateEventModal} from '../../../components/forms/Event';

// @ts-expect-error TS(2307) FIXME: Cannot find module '../../../components/forms/Note... Remove this comment to see the full error message
import {SetEventNotesMutation} from '../../../components/forms/Notes.gql';
import DaysUntilEvent from '../../../components/DaysUntilEvent';
import {CreateSponsorModal} from '../../../components/forms/Sponsor';
import {CreateScheduleItemModal} from '../../../components/forms/ScheduleItem';
import ScheduleBox from '../../../components/ScheduleBox';
import TicketBox from "../../../components/TicketBox";
import EventRestrictionBox from "../../../components/EventRestrictionBox";
import InfoBox from "../../../components/InfoBox";
import MetadataBox from '../../../components/MetadataBox';


export default function Event({
    event
}: any) {
    if (!event) return <Page/>;
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event}/>
            <Heading>
                {event.name} ({event.displayDate})
                <UpdateEventModal event={event}/>
                <DeleteEventModal event={event} />
            </Heading>
            <Text>{event.eventGroup.name}</Text>
            <DaysUntilEvent event={event}/>
            <ResponsiveMasonry>
                <Masonry>
                    <VenueInfo
                      venue={event.venue}
                      buttons={!event.venue && <CreateVenueModal event={event}><Icon.UiAdd/></CreateVenueModal>}
                    >
                    </VenueInfo>
                    <RegistrationsToggleWithChecklist event={event}/>
                    <SponsorOverview
                        sponsors={event.sponsors}
                        heading="Sponsors"
                        currencySymbol={event.region?.currencySymbol}
                        buttons={
                          <>
                            <Button h={6} as="a" href={`${event.id}/sponsors`}><Icon.Eye /></Button>
                            &nbsp;
                            <CreateSponsorModal event={event}><Icon.UiAdd/></CreateSponsorModal>
                          </>
                        }
                    >
                    </SponsorOverview>
                    <RegistrationGraph
                        event={event}
                        buttons={
                            <Button h={6} as="a" href={`${event.id}/tickets`}><Icon.Eye /></Button>
                        }
                    >
                    </RegistrationGraph>
                    <ScheduleBox
                        schedule={event.schedule}
                        buttons={
                            <>
                                <Button h={6} as="a" href={`${event.id}/schedule`}><Icon.Eye /></Button>
                                &nbsp;
                                <CreateScheduleItemModal event={event}><Icon.UiAdd/></CreateScheduleItemModal>
                            </>
                        }
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
                            ...event.cmsEventRestrictions
                        ]}
                        buttons={
                            <Button h={6} as="a" href={`${event.id}/eventRestrictions`}>
                                <Icon.Eye />
                            </Button>
                        }
                    />
                    <InfoBox heading="Actions">
                      <Button w="100%" mb={2} as="a" href={`${event.id}/tickets/scan`}>Check-In/Out</Button>
                      <Button w="100%" mb={2} as="a" href={`${event.id}/notification`}>Send Notification</Button>
                      <Button w="100%" mb={2} as="a" href={`${event.id}/advancedConfig`}>Edit Advanced Config</Button>
                      <Button w="100%" mb={2} as="a" target="_blank" href={`https://showcase.codeday.org/projects/all/event=${event.id}`}>View Projects</Button>
                      <Button w="100%" mb={2} as="a" target="_blank" href={`https://showcase.codeday.org/upload-photos`}>Upload Photos</Button>
                    </InfoBox>
                    // @ts-expect-error TS(2786): 'MetadataBox' cannot be used as a JSX component.
                    // @ts-expect-error TS(2786) FIXME: 'MetadataBox' cannot be used as a JSX component.
                    <MetadataBox metadata={event.metadata}>
                      <Link href={`${event.id}/advancedConfig`}>Set metadata (advanced)</Link>
                    </MetadataBox>
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    );
}

export async function getServerSideProps({
    req,
    res,
    query: {event: eventId}
}: any) {
    const session = await getSession({req});

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = getFetcher(session);
    if (!session) return {props: {}};

    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
    const eventResults = await fetch(getEventQuery, {data: {id: eventId}});
    const event = eventResults?.clear?.event
    if (!event) return {
        redirect: {
            destination: `/events`,
            permanent: false
        }
    }
    return {
        props: {
            event: event,
        },
    };
}
