import React, { useState } from 'react';
import { useToasts } from '@codeday/topo/utils';
import { Heading, Text, TextInput, Textarea, Checkbox, Button, Spinner } from '@codeday/topo/Atom';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { Page } from 'src/components/Page';

import { graphql } from 'generated/gql';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'urql';
import NotFound from 'src/pages/404';

const sendNotification = graphql(`
  mutation SendNotification(
    $where: ClearEventWhereUniqueInput!
    $guardian: Boolean!
    $emailBody: String
    $emailSubject: String
    $smsBody: String
  ) {
    clear {
      sendNotification(
        eventWhere: $where
        emailBody: $emailBody
        emailSubject: $emailSubject
        smsBody: $smsBody
        guardian: $guardian
      )
    }
  }
`);

const query = graphql(`
  query EventNotificationPage($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        name
      }
    }
  }
`);

export default function Notification() {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({ query, variables: { where: { id: router.query.event as string } } });
  const [sendNotificationResult, doSendNotification] = useMutation(sendNotification);

  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [guardian, setGuardian] = useState(false);
  const { success, error } = useToasts();

  const event = data?.clear?.event;
  if (event === null && !fetching) {
    return <NotFound />;
  }
  if (!event) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page title={event.name}>
      <Breadcrumbs event={event} />
      <Heading>{event.name} ~ Send Notification</Heading>
      <Text>
        To send only an email or SMS, leave the other options blank. Email body uses Markdown. You can use {'{{'}
        ticket.id{'}}'} and {'{{'}to.firstName{'}}'} style templates.
      </Text>
      <TextInput placeholder="Email Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
      <Textarea placeholder="Email Body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} mb={2} />
      <Textarea placeholder="SMS/WhatsApp Body" value={smsBody} onChange={(e) => setSmsBody(e.target.value)} mb={2} />
      <Button
        isLoading={sendNotificationResult.fetching}
        disabled={!(smsBody || (emailBody && emailSubject)) || sendNotificationResult.fetching}
        onClick={async () => {
          const result = await doSendNotification({
            where: { id: event.id },
            emailBody: emailBody || null,
            emailSubject: emailSubject || null,
            smsBody: smsBody || null,
            guardian,
          });
          if (result.error) {
            error(result.error.name, result.error.message);
          } else if (result.data?.clear?.sendNotification) {
            success(`Notification sent.`);
          } else {
            error('Unknown Error', 'Notification was not sent.');
          }
        }}
      >
        Send
      </Button>
      <Checkbox ml={2} mt={2} checked={guardian} onChange={(e) => setGuardian(e.target.checked)}>
        Send to guardian instead.
      </Checkbox>
    </Page>
  );
}
