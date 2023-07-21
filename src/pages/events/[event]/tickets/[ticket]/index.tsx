import React from 'react';
import Page from '../../../../../components/Page';
import {getFetcher} from '../../../../../fetch';

// @ts-expect-error TS(2307) FIXME: Cannot find module './ticket.gql' or its correspon... Remove this comment to see the full error message
import {getTicket} from './ticket.gql';
import {Button, Heading, Text} from "@codeday/topo/Atom";
import {TicketTypeBadge} from "../../../../../components/Ticket";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import Alert from "../../../../../components/Alert";
import {getSession} from "next-auth/react";
import {DeleteTicketModal, UpdateTicketModal} from "../../../../../components/forms/Ticket";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import InfoBox from "../../../../../components/InfoBox";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import {DevicePhone, Email, IdCard, Ticket, UiAdd} from "@codeday/topocons/Icon"
import Confidential from "../../../../../components/Confidential";
import {CreateGuardianModal, DeleteGuardianModal, UpdateGuardianModal} from "../../../../../components/forms/Guardian";
import moment from "moment";
import MetadataBox from '../../../../../components/MetadataBox';

// @ts-expect-error TS(2307) FIXME: Cannot find module '../../../../../components/form... Remove this comment to see the full error message
import {SetTicketNotesMutation} from '../../../../../components/forms/Notes.gql';
import Notes from "../../../../../components/forms/Notes";


export default function TicketPage({
    ticket
}: any) {
    if (!ticket) return <Page/>
    return (
        <Page>
            <Breadcrumbs event={ticket.event} ticket={ticket}/>
            <Confidential />
            <Heading display="inline"><Ticket />{ticket.firstName} {ticket.lastName}</Heading>
            <TicketTypeBadge ml={2} ticket={ticket}/>
            <UpdateTicketModal ticket={ticket}/>
            <DeleteTicketModal ticket={ticket}/>
            <ResponsiveMasonry>
                <Masonry>
                    <InfoBox heading="Attendee details">
                        {ticket.email && <><Email /> Email: {ticket.email} <br/></>}
                        {ticket.phone && <><DevicePhone /> Phone: {ticket.phone} <br/></>}
                        {ticket.whatsApp && <><DevicePhone /> WhatsApp: {ticket.whatsApp} <br/></>}
                        <IdCard /> {ticket.age} years old
                        {ticket.waiverPdfUrl && <><br /><Button as="a" target="_blank" href={ticket.waiverPdfUrl}>Waiver</Button></>}
                    </InfoBox>
                    {ticket.age < 18? (
                        <InfoBox
                            heading={<>
                                <Text display="inline">Guardian details</Text>
                                {ticket.guardian? <>
                                        <UpdateGuardianModal guardian={ticket.guardian}/>
                                    <DeleteGuardianModal guardian={ticket.guardian} />
                                </>: <CreateGuardianModal ticket={ticket} display="inline"><UiAdd /></CreateGuardianModal>}
                            </>}>
                            {ticket.guardian? (
                                    <>
                                        <IdCard />{ticket.guardian.firstName} {ticket.guardian.lastName} <br/>
                                        {ticket.guardian.email && <><Email />Email: {ticket.guardian.email} <br/></>}
                                        {ticket.guardian.phone && <><DevicePhone />Phone: {ticket.guardian.phone} <br/></>}
                                        {ticket.guardian.whatsApp && <><DevicePhone />WhatsApp: {ticket.guardian.whatsApp} <br/></>}
                                    </>) : (
                                        <Alert>No Guardian Info</Alert>
                            )}
                                </InfoBox>
                                ): null}
                    <InfoBox heading="Payment Details">
                        Registered on: {moment(ticket.createdAt).format('LL')} <br/>
                        Promo Code used: {ticket.promoCode?.code || 'N/A'} <br/>
                        Payment intent ID: {ticket.payment?.stripePaymentIntentId || 'N/A'}
                    </InfoBox>
                    // @ts-expect-error TS(2786): 'MetadataBox' cannot be used as a JSX component.
                    // @ts-expect-error TS(2786) FIXME: 'MetadataBox' cannot be used as a JSX component.
                    <MetadataBox
                        title="Survey Responses"
                        hideChangeNote
                        metadata={
                            Object.fromEntries(
                                Object.entries(ticket.surveyResponses || {})
                                    .filter(([k, v]) => !k.startsWith('study.')
                                )
                            )
                        }
                    />
                    // @ts-expect-error TS(2786): 'MetadataBox' cannot be used as a JSX component.
                    // @ts-expect-error TS(2786) FIXME: 'MetadataBox' cannot be used as a JSX component.
                    <MetadataBox metadata={ticket.metadata} />
                    <Notes
                        notes={ticket.notes}
                        updateId={ticket.id}
                        headingSize="xl"
                        updateMutation={SetTicketNotesMutation}
                    />
                        </Masonry>
                        </ResponsiveMasonry>
                        </Page>
                        );
                        }

                        export async function getServerSideProps({
                            req,
                            query: {event: eventId, ticket: ticketId}
                        }: any) {
                        const session = await getSession({req})

                        // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
                        const fetch = getFetcher(session);
                        if (!session) return {props: {}}

                        // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                        const ticketResult = await fetch(getTicket, {data: {id: ticketId}})
                        const ticket = ticketResult?.clear?.ticket
                        if (!ticket) return {
                        redirect: {
                        destination: `/events/${eventId}/tickets`,
                        permanent: false
                    }
                    }
                        return {
                        props: {
                        ticket: ticket
                    }
                    }
                    }
