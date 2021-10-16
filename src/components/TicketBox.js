import React from 'react';
import InfoBox from "./InfoBox";
import {Calendar, PaymentCash, PaymentDiscount} from "@codeday/topocons/Icon"
import Alert, {GoodAlert} from "./Alert";
import moment from "moment-timezone";
import Text from "@codeday/topo/Atom/Text"

export default function TicketBox({event, children, ...props}) {
    return (
        <InfoBox heading="Ticket Details">
            <Text>
                <PaymentCash />Regular Ticket Price: {event.ticketPrice}
            </Text>
            <Text>
                <Calendar />Registration Deadline: {moment(event.registrationCutoff).utc().format('LL')}
            </Text>
            <Text>
                <PaymentDiscount />Early Bird Ticket Price: {event.earlyBirdPrice}
            </Text>
            <Text>
                <Calendar />Early Bird Deadline: {moment(event.earlyBirdCutoff).utc().format('LL')}
            </Text>
            {event.canEarlyBirdRegister? <GoodAlert>Early Bird Active</GoodAlert>: <Alert>Early Bird Inactive</Alert>}
            {event.canRegister? <GoodAlert>Registrations Active</GoodAlert>: <Alert>Registrations Inactive</Alert>}
            {children}
        </InfoBox>
    )
}
