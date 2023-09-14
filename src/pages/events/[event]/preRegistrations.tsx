import React, { useEffect, useState } from 'react';
import { useToasts } from '@codeday/topo/utils';
import { Heading, Text, TextInput, Textarea, Button, Spinner } from '@codeday/topo/Atom';
import { getSession } from 'next-auth/react';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { Page } from 'src/components/Page';
import { graphql } from 'generated/gql';
import { useMutation, useQuery } from 'urql';
import { useRouter } from 'next/router';
import NotFound from 'src/pages/404';

const query = graphql(`
  query EventInterestedPage($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        name
        contentfulWebname
        interestedEmails {
          id
          email
        }
      }
    }
  }
`);

const sendInterestedEmail = graphql(`
  mutation SendEventPreRegsitrationsEmail($where: ClearEventWhereUniqueInput!, $subject: String!, $body: String!) {
    clear {
      sendInterestedEmail(eventWhere: $where, subject: $subject, body: $body)
    }
  }
`);

export default function PreRegistrations() {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({ query, variables: { where: { id: router.query.event as string } } });
  const [sendInterestedEmailResult, doSendInterestedEmail] = useMutation(sendInterestedEmail);
  const event = data?.clear?.event;
  const [emailSubject, setEmailSubject] = useState<string>();
  const [emailBody, setEmailBody] = useState<string>();
  const { success, error } = useToasts();

  useEffect(() => {
    // prefill subject and body, but only if they are undefined
    // this is to make sure we don't overwrite a draft if for whatever reason `event` updates (even though it shouldn't)
    if (event) {
      setEmailSubject((es) => es || `Tickets available for CodeDay ${event.name}`);
      setEmailBody(
        (eb) =>
          eb ||
          `Hi there! A while ago, you asked us to let you know when registrations for CodeDay ${event.name} opened.\n\nToday's the day! Get your tickets at [https://codeday.org/${event.contentfulWebname}](https://event.codeday.org/${event.contentfulWebname})`,
      );
    }
  }, [event]);
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
      <Heading>{event.name} ~ Pre Registrations</Heading>
      <Text>Email body uses markdown.</Text>

      <Text>
        <Text as="span" fontWeight="bold" mr={2}>
          To:
        </Text>
        <TextInput
          w="calc(100% - 3em)"
          readOnly
          value={event.interestedEmails.map((email: any) => email.email).join(', ')}
        />
      </Text>
      <TextInput placeholder="Email Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
      <Textarea placeholder="Email Body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} mb={2} />
      <Button
        isLoading={sendInterestedEmailResult.fetching}
        disabled={!(emailBody && emailSubject) || sendInterestedEmailResult.fetching}
        onClick={async () => {
          if (!emailBody || !emailSubject) return error('Missing email contents');
          const res = await doSendInterestedEmail({
            where: { id: event.id },
            body: emailBody,
            subject: emailSubject,
          });
          if (res.error) {
            error(res.error.name, res.error.message);
          } else if (res.data?.clear?.sendInterestedEmail) {
            success('Email sent!');
          } else {
            error('Unknown error', 'Email was not sent');
          }
        }}
      >
        Send
      </Button>
    </Page>
  );
}
