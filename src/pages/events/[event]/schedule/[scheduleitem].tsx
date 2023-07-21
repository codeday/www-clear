import React from 'react';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import {Heading, Link} from '@codeday/topo/Atom';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from '@codeday/topocons/Icon';
import {getSession} from 'next-auth/react';
import {getFetcher} from '../../../../fetch';

// @ts-expect-error TS(2307) FIXME: Cannot find module './scheduleitem.gql' or its cor... Remove this comment to see the full error message
import {GetScheduleItemQuery} from './scheduleitem.gql';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import Page from '../../../../components/Page';
import InfoBox from '../../../../components/InfoBox';
import {DeleteScheduleItemModal, UpdateScheduleItemModal} from '../../../../components/forms/ScheduleItem';
import ContactBox from '../../../../components/ContactBox';

// @ts-expect-error TS(2307) FIXME: Cannot find module '../../../../components/forms/N... Remove this comment to see the full error message
import {SetScheduleItemNotesMutation} from '../../../../components/forms/Notes.gql';
import Notes from '../../../../components/forms/Notes';

export default function ScheduleItem({
    scheduleitem
}: any) {
    if (!scheduleitem) return <Page/>;
    return (
        <Page title={scheduleitem.name}>
            <Breadcrumbs event={scheduleitem.event} scheduleitem={scheduleitem}/>
            <Heading>
                {scheduleitem.type ? `${scheduleitem.type}: ` : null} {scheduleitem.name}
                <UpdateScheduleItemModal scheduleitem={scheduleitem}/>
                <DeleteScheduleItemModal scheduleitem={scheduleitem}/>
            </Heading>
            <Heading size="md">
                {scheduleitem.displayTimeWithDate}
            </Heading>
            <Link>{scheduleitem.link}</Link>
            <ResponsiveMasonry>
                <Masonry>
                    <InfoBox heading="Description">
                        {scheduleitem.description}
                    </InfoBox>
                    <InfoBox heading="Host">
                        <Icon.IdCard/>{scheduleitem.hostName} ({scheduleitem.hostPronoun}) <br/>
                        <Icon.Email/>{scheduleitem.hostEmail}
                    </InfoBox>
                    <InfoBox heading="Internal">
                        <ContactBox
                            heading="Organizer"
                            name={scheduleitem.organizerName}
                            email={scheduleitem.organizerEmail}
                            phone={scheduleitem.organizerPhone}
                        />
                        <Notes notes={scheduleitem.notes}
                               updateId={scheduleitem.id}
                               updateMutation={SetScheduleItemNotesMutation}/>
                    </InfoBox>
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    );
}

export async function getServerSideProps({
    req,
    res,
    query: {scheduleitem: itemId}
}: any) {
    const session = await getSession({req});

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = getFetcher(session);
    if (!session) return {props: {}};

    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
    const scheduleitemResults = await fetch(GetScheduleItemQuery, {data: {id: itemId}});
    return {
        props: {
            scheduleitem: scheduleitemResults.clear.scheduleItem,
        },
    };
}
