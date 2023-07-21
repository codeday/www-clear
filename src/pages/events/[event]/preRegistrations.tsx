import React, { useState } from "react";
import Page from "../../../components/Page";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useToasts } from "@codeday/topo/utils";
import {Heading, Text, TextInput, Textarea, Button} from "@codeday/topo/Atom";
import {getSession} from "next-auth/react";

// @ts-expect-error TS(2307) FIXME: Cannot find module './preRegistrations.gql' or its... Remove this comment to see the full error message
import {getEventPreRegistrationsQuery,SendEventPreRegsitrationsEmail} from "./preRegistrations.gql"
import {useFetcher, getFetcher} from "../../../fetch";

export default function PreRegistrations({
    event
}: any) {

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 0.
    const fetch = useFetcher();
    const [emailSubject, setEmailSubject] = useState(`Tickets available for CodeDay ${event.name}`);
    const [emailBody, setEmailBody] = useState(`Hi there! A while ago, you asked us to let you know when registrations for CodeDay ${event.name} opened.\n\nToday's the day! Get your tickets at [https://event.codeday.org/${event.contentfulWebname}](https://event.codeday.org/${event.contentfulWebname})`);
    const [isLoading, setIsLoading] = useState(false);
    const { success, error } = useToasts();

    if (!event) return <Page />
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event} />
            <Heading>{event.name} ~ Pre Registrations</Heading>
            <Text>Email body uses markdown.</Text>

            <Text>
                <Text as="span" fontWeight="bold" mr={2}>To:</Text>
                <TextInput w="calc(100% - 3em)" readOnly value={event.interestedEmails.map((email: any) => email.email).join(', ')} />
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
            <Button
              isLoading={isLoading}
              disabled={!(emailBody && emailSubject)}
              onClick={async () => {
                setIsLoading(true);

                    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                    await fetch(
                        SendEventPreRegsitrationsEmail,
                        {
                            eventId: event.id,
                            body: emailBody,
                            subject: emailSubject,
                        }
                    );
                    success(`Notification sent.`);
                setIsLoading(false);
              }}
            >
              Send
            </Button>
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
    const eventResults = await fetch(getEventPreRegistrationsQuery, {data: {id: eventId}});
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
