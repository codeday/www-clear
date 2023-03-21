import React, { useState } from 'react';
import { useToasts } from '@codeday/topo/utils';
import {
  Heading, Text, TextInput, Textarea, Checkbox, Button,
} from '@codeday/topo/Atom';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Page from '../../../components/Page';
import { SendNotification, getEventQuery } from './notification.gql';
import { useFetcher, getFetcher } from '../../../fetch';

export default function Notification({ event }) {
  const fetch = useFetcher();
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [guardian, setGuardian] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToasts();

  return (
    <>
      <Breadcrumbs event={event} />
      <Heading>{event.name} ~ Send Notification</Heading>
      <Text>
        To send only an email or SMS, leave the other options blank. Email body uses Markdown.
        You can use {'{{'}ticket.id{'}}'} and {'{{'}to.name{'}}'} style templates.
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
            await fetch(
              SendNotification,
              {
                eventId: event.id,
                emailBody: emailBody || null,
                emailSubject: emailSubject || null,
                smsBody: smsBody || null,
                guardian,
              },
            );
          } catch (ex) { error(ex); }
          setIsLoading(false);
        }}
      >
        Send
      </Button>
      <Checkbox ml={2} mt={2} checked={guardian} onChange={(e) => setGuardian(e.target.checked)}>Send to guardian instead.</Checkbox>
    </>
  );
}

export async function getServerSideProps({ req, res, query: { event: eventId } }) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const eventResults = await fetch(getEventQuery, { data: { id: eventId } });
  const event = eventResults?.clear?.event;
  if (!event) {
    return {
      redirect: {
        destination: `/events`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      event,
      title: event.name,
    },
  };
}
