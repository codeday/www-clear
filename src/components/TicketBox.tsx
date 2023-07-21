import React from 'react';
import InfoBox from "./InfoBox";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import {Calendar, PaymentCash, PaymentDiscount} from "@codeday/topocons"
import Alert, {GoodAlert} from "./Alert";
import moment from "moment-timezone";
import {Text} from "@codeday/topo/Atom";

export default function TicketBox({
    event,
    children,
    ...props
}: any) {
    return (
        <InfoBox headingSize="xl" heading="Pricing" {...props}>
            <Text mb={0}>
                <PaymentDiscount />Early Bird Ticket Price: {event.region?.currencySymbol}{event.earlyBirdPrice}
            </Text>
            <Text mb={0}>
                <Calendar />Early Bird Deadline: {moment(event.earlyBirdCutoff).utc().format('LL')}
            </Text>
            {event.registrationsOpen? event.canEarlyBirdRegister ? <GoodAlert>Early Bird Active</GoodAlert> : <Alert>Early Bird Inactive</Alert> : null}
            <Text mb={0} mt={2}>
                <PaymentCash />Regular Ticket Price: {event.region?.currencySymbol}{event.ticketPrice}
            </Text>
            <Text mb={0}>
                <Calendar />Registration Deadline: {moment(event.registrationCutoff).utc().format('LL')}
            </Text>
            {event.registrationsOpen? event.canRegister ? <GoodAlert>Registrations Active</GoodAlert> : <Alert>Registrations Inactive</Alert> : null}
            {children}
        </InfoBox>
    )
}
