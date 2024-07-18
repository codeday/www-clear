import React, { useState } from "react";
import Page from "../../../components/Page";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useToasts } from "@codeday/topo/utils";
import {Heading, Text, TextInput, Textarea, Checkbox, Button, FormErrorMessage} from "@codeday/topo/Atom";
import {getSession} from "next-auth/react";
import {SendNotification, getEventQuery} from "./notification.gql"
import {useFetcher, getFetcher} from "../../../fetch";
import Alert from "../../../components/Alert";

const MAX_SMS_LENGTH = 280

export default function Notification({event}) {
    const fetch = useFetcher();
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [smsBody, setSmsBody] = useState('');
    const [guardian, setGuardian] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { success, error } = useToasts();

    return (
        <Page title={event.name}>
            <Breadcrumbs event={event} />
            <Heading>{event.name} ~ Send Notification</Heading>
            <Text>
              To send only an email or SMS, leave the other options blank. Email body uses Markdown.
              You can use {'{{'}ticket.id{'}}'} and {'{{'}to.firstName{'}}'} style templates.
            </Text>
            <TextInput
              placeholder="Email Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <Textarea
              placeholder="Email Body"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              mb={2}
            />
            <Textarea
              placeholder={`SMS/WhatsApp Body (Max ${MAX_SMS_LENGTH} char)`}
              value={smsBody}
              onChange={(e) => setSmsBody(e.target.value)}
              mb={2}
              isInvalid={smsBody.length > MAX_SMS_LENGTH}
            />
            { smsBody.length > MAX_SMS_LENGTH ? <Alert>SMS/WhatsApp Body must be {MAX_SMS_LENGTH} characters or less</Alert> : <></>}
            <Button
              isLoading={isLoading}
              isDisabled={(smsBody.length >= MAX_SMS_LENGTH) || !(smsBody || (emailBody && emailSubject))}
              onClick={async () => {
                success(`Notification sent.`);
                setIsLoading(true);
                try {
                  await fetch(
                    SendNotification,
                    {
                      eventId: event.id,
                      emailBody: emailBody || null,
                      emailSubject: emailSubject || null,
                      smsBody: smsBody || null,
                      guardian,
                    }
                  );
                } catch (ex) { error(ex); }
                setIsLoading(false);
              }}
            >
              Send {smsBody.length}
            </Button>
            <Checkbox ml={2} mt={2} checked={guardian} onChange={(e) => setGuardian(e.target.checked)}>Send to guardian instead.</Checkbox>
        </Page>
    )
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
