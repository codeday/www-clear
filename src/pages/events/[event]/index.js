import React from 'react';
import {print} from 'graphql';
import Text, {Heading, Link} from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import * as Icon from '@codeday/topocons/Icon';
import {getSession} from 'next-auth/react';
import Page from '../../../components/Page';
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
import {SetEventNotesMutation} from '../../../components/forms/Notes.gql';
import DaysUntilEvent from '../../../components/DaysUntilEvent';
import {CreateSponsorModal} from '../../../components/forms/Sponsor';
import {CreateScheduleItemModal} from '../../../components/forms/ScheduleItem';
import ScheduleBox from '../../../components/ScheduleBox';
import TicketBox from "../../../components/TicketBox";
import EventRestrictionBox from "../../../components/EventRestrictionBox";
import InfoBox from "../../../components/InfoBox";


export default function Event({event}) {
    if (!event) return <Page/>;
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event}/>
            <Heading>{event.name} ({event.displayDate})<UpdateEventModal event={event}/><DeleteEventModal event={event} /></Heading>
            <Text>{event.eventGroup.name}</Text>
            <DaysUntilEvent event={event}/>
            <ResponsiveMasonry>
                <Masonry>
                    <VenueInfo
                      venue={event.venue}
                      buttons={!event.venue && <CreateVenueModal event={event}><Icon.UiAdd/></CreateVenueModal>}
                    >
                        {!event.venue && <Alert>No Venue</Alert>}
                    </VenueInfo>
                    <RegistrationsToggleWithChecklist event={event}/>
                    <SponsorOverview
                        sponsors={event.sponsors}
                        heading="Sponsors"
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
                        restrictions={event.eventRestrictions}
                        buttons={
                            <Button h={6} as="a" href={`${event.id}/eventRestrictions`}>
                                <Icon.Eye />
                            </Button>
                        }
                    />
                    <InfoBox heading="Metadata">
                        {JSON.stringify(event.metadata, null, 2)}
                    </InfoBox>
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    );
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req});
    const fetch = getFetcher(session);
    if (!session) return {props: {}};
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
