import React from 'react';
import {print} from 'graphql';
import Text, {Heading, Link} from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import * as Icon from '@codeday/topocons/Icon';
import {getSession} from 'next-auth/client';
import Page from '../../../components/Page';
import {getEvent} from './index.gql';
import {useFetcher} from '../../../fetch';
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
                    <VenueInfo venue={event.venue}>
                        {event.venue ? null : <><Alert>No Venue</Alert><CreateVenueModal event={event}/></>}
                    </VenueInfo>
                    <RegistrationsToggleWithChecklist event={event}/>
                    <SponsorOverview sponsors={event.sponsors}
                                     heading={<>Sponsors <CreateSponsorModal event={event}><Icon.UiAdd/></CreateSponsorModal> </>}>
                        <Button as="a" href={`${event.id}/sponsors`}>View Sponsors</Button>
                    </SponsorOverview>
                    <RegistrationGraph event={event}>
                        <Button as="a" href={`${event.id}/tickets`}>View Registrations</Button>
                    </RegistrationGraph>
                    <ScheduleBox schedule={event.schedule}
                                 heading={<>Schedule <CreateScheduleItemModal event={event}><Icon.UiAdd/></CreateScheduleItemModal></>}>
                        <Button as="a" href={`${event.id}/schedule`}>View Schedule</Button>
                    </ScheduleBox>
                    <Notes notes={event.notes} updateId={event.id} updateMutation={SetEventNotesMutation}/>
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    );
}

export async function getServerSideProps({req, res, query: {event: eventId}}) {
    const session = await getSession({req});
    const fetch = useFetcher(session);
    if (!session) return {props: {}};
    const eventResults = await fetch(print(getEvent), {data: {id: eventId}});
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
