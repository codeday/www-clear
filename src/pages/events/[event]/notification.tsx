import React, { useState } from "react";
import Page from "../../../components/Page";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useToasts } from "@codeday/topo/utils";
import {Heading, Text, TextInput, Textarea, Checkbox, Button} from "@codeday/topo/Atom";
import {getSession} from "next-auth/react";

// @ts-expect-error TS(2307) FIXME: Cannot find module './notification.gql' or its cor... Remove this comment to see the full error message
import {SendNotification, getEventQuery} from "./notification.gql"
import {useFetcher, getFetcher} from "../../../fetch";

export default function Notification({
  event
}: any) {

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 0.
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
              placeholder="SMS/WhatsApp Body"
              value={smsBody}
              onChange={(e) => setSmsBody(e.target.value)}
              mb={2}
            />
            <Button
              isLoading={isLoading}
              disabled={!(smsBody || (emailBody && emailSubject))}
              onClick={async () => {
                success(`Notification sent.`);
                setIsLoading(true);
                try {

                  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
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
                // @ts-expect-error TS(2345) FIXME: Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
                } catch (ex) { error(ex); }
                setIsLoading(false);
              }}
            >
              Send
            </Button>
            <Checkbox ml={2} mt={2} checked={guardian} onChange={(e) => setGuardian(e.target.checked)}>Send to guardian instead.</Checkbox>
        </Page>
    )
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
